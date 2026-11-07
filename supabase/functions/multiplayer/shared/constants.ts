import {
  API_VERSION,
  CHOICE_ID,
  CHOICE_IDS,
  MULTIPLAYER_OPERATION,
  MULTIPLAYER_ERROR_CODE,
  MULTIPLAYER_SHARED_CONFIG,
  PARTICIPANT_STATUS,
  ROOM_STATUS,
  SCENARIO_IDS,
  type ChoiceId,
  type MultiplayerOperation,
  type ParticipantStatus,
  type RoomStatus,
} from '../../../../shared/multiplayer/contracts.ts'

export {
  API_VERSION,
  CHOICE_ID,
  CHOICE_IDS,
  MULTIPLAYER_OPERATION,
  MULTIPLAYER_ERROR_CODE,
  MULTIPLAYER_SHARED_CONFIG,
  PARTICIPANT_STATUS,
  ROOM_STATUS,
  SCENARIO_IDS,
}
export type { MultiplayerOperation, ParticipantStatus, RoomStatus }
export type { ChoiceId }

export const OPERATION = MULTIPLAYER_OPERATION
export type Operation = MultiplayerOperation
export const QUESTION_STATUS = { OPEN: 'OPEN', ANSWERED: 'ANSWERED' } as const

export const MULTIPLAYER_CONFIG = {
  ...MULTIPLAYER_SHARED_CONFIG,
  totalQuestions: SCENARIO_IDS.length,
  maxRoomPlayers: 100,
  roomCodeAlphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  sessionHeartbeatMs: MULTIPLAYER_SHARED_CONFIG.heartbeatIntervalMs,
  createRoomAttempts: 5,
} as const

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const

export const ERROR_CODE = MULTIPLAYER_ERROR_CODE
