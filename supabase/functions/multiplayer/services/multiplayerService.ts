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
  markParticipantConnected,
  markParticipantDisconnected,
  openQuestion,
  submitAnswer,
  updateRoomStatus,
  advanceRoomQuestion,
} from '../repositories/roomRepository.ts'
import { getRoomView } from './roomViewService.ts'
import {
  ERROR_CODE,
  HTTP_STATUS,
  MULTIPLAYER_CONFIG,
  OPERATION,
  PARTICIPANT_STATUS,
  type Operation,
} from '../shared/constants.ts'
import { isCorrectChoice } from '../../../../shared/quiz/scenarioAnswerKey.ts'

type OperationHandler = (body: Record<string, unknown>) => Promise<unknown>

async function authorizeRoomAccess(body: Record<string, unknown>, roomId: string): Promise<string | undefined> {
  const presenterToken = typeof body.presenterToken === 'string' ? body.presenterToken.trim() : ''
  if (presenterToken) {
    const room = await findRoomById(roomId, true)
    if ((await hashToken(presenterToken)) !== room.presenter_token_hash)
      throw new AppError(ERROR_CODE.PRESENTER_NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
    return undefined
  }

  const participantToken = typeof body.participantToken === 'string' ? body.participantToken.trim() : ''
  if (participantToken) {
    const participant = await findParticipantByTokenHash(await hashToken(participantToken))
    if (participant.room_id !== roomId)
      throw new AppError(ERROR_CODE.PARTICIPANT_NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
    return participant.id
  }

  throw new AppError(ERROR_CODE.PARTICIPANT_NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
}

const operationHandlers: Record<Operation, OperationHandler> = {
  [OPERATION.CREATE_ROOM]: () => createRoom(),
  [OPERATION.JOIN_ROOM]: joinRoom,
  [OPERATION.LEAVE_ROOM]: leaveRoom,
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

async function leaveRoom(body: Record<string, unknown>) {
  const participantToken = requiredString(body, 'participantToken')
  const participant = await findParticipantByTokenHash(await hashToken(participantToken))
  await markParticipantDisconnected(participant.id)
  await broadcastRoomUpdated(participant.room_id)
  return { left: true }
}

async function resumeParticipant(body: Record<string, unknown>) {
  const participantToken = requiredString(body, 'participantToken')
  const participant = await findParticipantByTokenHash(await hashToken(participantToken))
  const room = await findRoomById(participant.room_id, true)
  const participantStatus =
    room.status === ROOM_STATUS.WAITING
      ? PARTICIPANT_STATUS.WAITING
      : room.status === ROOM_STATUS.IN_PROGRESS
        ? PARTICIPANT_STATUS.PLAYING
        : PARTICIPANT_STATUS.FINISHED
  await markParticipantConnected(participant.id, participantStatus)
  return {
    room: await getRoomView(room.id, participant.id),
    participantId: participant.id,
    participantToken,
    scenarioOrder: room.scenario_order,
  }
}

async function getRoom(body: Record<string, unknown>) {
  const roomId = requiredString(body, 'roomId')
  const currentParticipantId = await authorizeRoomAccess(body, roomId)
  return getRoomView(roomId, currentParticipantId)
}

async function getLeaderboard(body: Record<string, unknown>) {
  const roomId = requiredString(body, 'roomId')
  const currentParticipantId = await authorizeRoomAccess(body, roomId)
  return { leaderboard: (await getRoomView(roomId, currentParticipantId)).leaderboard }
}

async function changeRoomStatus(body: Record<string, unknown>, operation: string) {
  const roomId = requiredString(body, 'roomId')
  const presenterToken = requiredString(body, 'presenterToken')
  const room = await findRoomById(roomId, true)
  if ((await hashToken(presenterToken)) !== room.presenter_token_hash)
    throw new AppError('PRESENTER_NOT_AUTHORIZED', HTTP_STATUS.FORBIDDEN)
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
    throw new AppError('PRESENTER_NOT_AUTHORIZED', HTTP_STATUS.FORBIDDEN)
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
  const submittedScenarioId = scenarioId(body)
  const submittedChoiceId = choiceId(body)
  const result = await submitAnswer({
    tokenHash: await hashToken(participantToken),
    scenarioId: submittedScenarioId,
    choiceId: submittedChoiceId,
    isCorrect: isCorrectChoice(submittedScenarioId, submittedChoiceId),
  })
  await broadcastRoomUpdated(participant.room_id)
  return result
}
