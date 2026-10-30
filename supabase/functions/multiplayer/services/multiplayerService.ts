import {
  assertRoomCanAcceptAnswers,
  assertRoomCanAdvance,
  assertRoomCanAcceptParticipants,
  createScenarioOrder,
  ROOM_STATUS,
  statusForOperation,
} from '../domain/rooms.ts'
import { createRoomCode, createSecret, hashToken } from '../domain/security.ts'
import { broadcastRoomUpdated } from '../infrastructure/supabase.ts'
import { AppError } from '../shared/errors.ts'
import { choiceId, parseOperation, requiredString, scenarioId, validateNickname } from '../validation/requests.ts'
import {
  countAnsweredQuestions,
  countAnsweredForQuestion,
  countParticipants,
  findParticipantByTokenHash,
  findRoomByCode,
  findRoomById,
  insertParticipant,
  insertRoom,
  openQuestion,
  submitAnswer,
  updateRoomStatus,
  advanceRoomQuestion,
} from '../repositories/roomRepository.ts'
import { getRoomView } from './roomViewService.ts'
import { ERROR_CODE, HTTP_STATUS, MULTIPLAYER_CONFIG, OPERATION, type Operation } from '../shared/constants.ts'

type OperationHandler = (body: Record<string, unknown>) => Promise<unknown>

const operationHandlers: Record<Operation, OperationHandler> = {
  [OPERATION.CREATE_ROOM]: () => createRoom(),
  [OPERATION.JOIN_ROOM]: joinRoom,
  [OPERATION.RESUME_PARTICIPANT]: resumeParticipant,
  [OPERATION.GET_ROOM]: getRoom,
  [OPERATION.GET_LEADERBOARD]: getLeaderboard,
  [OPERATION.START_ROOM]: (body) => changeRoomStatus(body, OPERATION.START_ROOM),
  [OPERATION.FINISH_ROOM]: (body) => changeRoomStatus(body, OPERATION.FINISH_ROOM),
  [OPERATION.CANCEL_ROOM]: (body) => changeRoomStatus(body, OPERATION.CANCEL_ROOM),
  [OPERATION.OPEN_QUESTION]: openQuestionForParticipant,
  [OPERATION.SUBMIT_ANSWER]: submitAnswerForParticipant,
  [OPERATION.ADVANCE_QUESTION]: advanceQuestion,
}

export function executeOperation(body: Record<string, unknown>): Promise<unknown> {
  return operationHandlers[parseOperation(body)](body)
}

async function createRoom() {
  const presenterToken = createSecret()
  const scenarioOrder = createScenarioOrder()
  let roomId: string | undefined
  for (let attempt = 0; attempt < MULTIPLAYER_CONFIG.createRoomAttempts && !roomId; attempt++) {
    try {
      roomId = (
        await insertRoom({ code: createRoomCode(), presenterTokenHash: await hashToken(presenterToken), scenarioOrder })
      ).id
    } catch (error) {
      if (attempt === 4) throw error
    }
  }
  if (!roomId) throw new AppError(ERROR_CODE.ROOM_CREATE_FAILED, HTTP_STATUS.INTERNAL_ERROR)
  return { room: await getRoomView(roomId), participantId: '', participantToken: '', presenterToken, scenarioOrder }
}

async function joinRoom(body: Record<string, unknown>) {
  const room = await findRoomByCode(requiredString(body, 'code').toUpperCase())
  assertRoomCanAcceptParticipants(room.status)
  if ((await countParticipants(room.id)) >= room.max_players) throw new AppError('ROOM_FULL')
  const { nickname, normalized } = validateNickname(requiredString(body, 'nickname'))
  const participantToken = createSecret()
  const participant = await insertParticipant({
    roomId: room.id,
    nickname,
    normalized,
    tokenHash: await hashToken(participantToken),
  })
  await broadcastRoomUpdated(room.id)
  return {
    room: await getRoomView(room.id, participant.id),
    participantId: participant.id,
    participantToken,
    scenarioOrder: room.scenario_order,
  }
}

async function resumeParticipant(body: Record<string, unknown>) {
  const participantToken = requiredString(body, 'participantToken')
  const participant = await findParticipantByTokenHash(await hashToken(participantToken))
  const room = await findRoomById(participant.room_id, true)
  return {
    room: await getRoomView(room.id, participant.id),
    participantId: participant.id,
    participantToken,
    scenarioOrder: room.scenario_order,
  }
}

async function getRoom(body: Record<string, unknown>) {
  return getRoomView(requiredString(body, 'roomId'))
}

async function getLeaderboard(body: Record<string, unknown>) {
  return { leaderboard: (await getRoomView(requiredString(body, 'roomId'))).leaderboard }
}

async function changeRoomStatus(body: Record<string, unknown>, operation: string) {
  const roomId = requiredString(body, 'roomId')
  const presenterToken = requiredString(body, 'presenterToken')
  const room = await findRoomById(roomId, true)
  if ((await hashToken(presenterToken)) !== room.presenter_token_hash)
    throw new AppError('PRESENTER_NOT_AUTHORIZED', 403)
  const status = statusForOperation(operation)
  const now = new Date().toISOString()
  await updateRoomStatus(
    roomId,
    status,
    status === ROOM_STATUS.IN_PROGRESS ? now : room.started_at,
    status === ROOM_STATUS.FINISHED || status === ROOM_STATUS.CANCELLED ? now : null,
  )
  await broadcastRoomUpdated(roomId)
  return getRoomView(roomId)
}

async function openQuestionForParticipant(body: Record<string, unknown>) {
  const participantToken = requiredString(body, 'participantToken')
  const participant = await findParticipantByTokenHash(await hashToken(participantToken))
  const room = await findRoomById(participant.room_id, true)
  const completed = await countAnsweredQuestions(participant.id)
  const id = scenarioId(body)
  assertRoomCanAcceptAnswers(room.status, room.scenario_order, completed, id, room.current_question_index)
  await openQuestion({ participantId: participant.id, scenarioId: id, questionIndex: completed })
  return { openedAt: new Date().toISOString() }
}

async function advanceQuestion(body: Record<string, unknown>) {
  const roomId = requiredString(body, 'roomId')
  const presenterToken = requiredString(body, 'presenterToken')
  const room = await findRoomById(roomId, true)
  if ((await hashToken(presenterToken)) !== room.presenter_token_hash)
    throw new AppError('PRESENTER_NOT_AUTHORIZED', 403)
  assertRoomCanAdvance(room.status, room.current_question_index)
  const scenarioId = room.scenario_order[room.current_question_index]
  const participantCount = await countParticipants(roomId)
  const answeredCount = await countAnsweredForQuestion(roomId, scenarioId)
  if (answeredCount < participantCount) throw new AppError('QUESTION_NOT_COMPLETE', 409)
  await advanceRoomQuestion(roomId, room.current_question_index)
  await broadcastRoomUpdated(roomId)
  return getRoomView(roomId)
}

async function submitAnswerForParticipant(body: Record<string, unknown>) {
  const participantToken = requiredString(body, 'participantToken')
  const participant = await findParticipantByTokenHash(await hashToken(participantToken))
  const result = await submitAnswer({
    tokenHash: await hashToken(participantToken),
    scenarioId: scenarioId(body),
    choiceId: choiceId(body),
  })
  await broadcastRoomUpdated(participant.room_id)
  return result
}
