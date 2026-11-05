import { AppError } from '../shared/errors.ts'
import {
  HTTP_STATUS,
  MULTIPLAYER_CONFIG,
  OPERATION,
  ROOM_STATUS,
  SCENARIO_IDS,
  type Operation,
  type RoomStatus,
} from '../shared/constants.ts'

export { ROOM_STATUS, type RoomStatus }
export const TOTAL_QUESTIONS = MULTIPLAYER_CONFIG.totalQuestions

export function createScenarioOrder(): number[] {
  return [...SCENARIO_IDS]
}

export function statusForOperation(operation: Operation): RoomStatus {
  if (operation === OPERATION.START_ROOM) return ROOM_STATUS.IN_PROGRESS
  if (operation === OPERATION.FINISH_ROOM) return ROOM_STATUS.FINISHED
  if (operation === OPERATION.CANCEL_ROOM) return ROOM_STATUS.CANCELLED
  throw new AppError('UNKNOWN_OPERATION')
}

export function assertRoomCanTransition(currentStatus: string, nextStatus: RoomStatus): void {
  const allowedTransitions: Record<string, RoomStatus[]> = {
    [ROOM_STATUS.WAITING]: [ROOM_STATUS.IN_PROGRESS, ROOM_STATUS.CANCELLED],
    [ROOM_STATUS.IN_PROGRESS]: [ROOM_STATUS.FINISHED, ROOM_STATUS.CANCELLED],
    [ROOM_STATUS.FINISHED]: [],
    [ROOM_STATUS.CANCELLED]: [],
  }

  if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
    throw new AppError('INVALID_ROOM_TRANSITION', HTTP_STATUS.CONFLICT)
  }
}

export function assertRoomCanAcceptParticipants(status: string): void {
  if (status !== ROOM_STATUS.WAITING) throw new AppError('ROOM_NOT_ACTIVE')
}

export function assertRoomCanAcceptAnswers(
  status: string,
  scenarioOrder: number[],
  completed: number,
  scenarioId: number,
  currentQuestionIndex = completed,
): void {
  if (status !== ROOM_STATUS.IN_PROGRESS) throw new AppError('ROOM_NOT_ACTIVE')
  if (scenarioOrder[currentQuestionIndex] !== scenarioId || completed !== currentQuestionIndex)
    throw new AppError('INVALID_SCENARIO')
}

export function assertRoomCanAdvance(status: string, currentQuestionIndex: number): void {
  if (status !== ROOM_STATUS.IN_PROGRESS) throw new AppError('ROOM_NOT_ACTIVE')
  if (currentQuestionIndex >= TOTAL_QUESTIONS - 1) throw new AppError('NO_MORE_QUESTIONS')
}
