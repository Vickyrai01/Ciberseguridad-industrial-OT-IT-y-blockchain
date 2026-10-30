export const API_VERSION = 'v1' as const

export const OPERATION = {
  CREATE_ROOM: 'createRoom',
  JOIN_ROOM: 'joinRoom',
  RESUME_PARTICIPANT: 'resumeParticipant',
  GET_ROOM: 'getRoom',
  GET_LEADERBOARD: 'getLeaderboard',
  START_ROOM: 'startRoom',
  FINISH_ROOM: 'finishRoom',
  CANCEL_ROOM: 'cancelRoom',
  OPEN_QUESTION: 'openQuestion',
  SUBMIT_ANSWER: 'submitAnswer',
} as const
export type Operation = (typeof OPERATION)[keyof typeof OPERATION]

export const ROOM_STATUS = {
  WAITING: 'WAITING',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED',
} as const
export type RoomStatus = (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS]
export const PARTICIPANT_STATUS = {
  WAITING: 'WAITING',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED',
  DISCONNECTED: 'DISCONNECTED',
} as const
export const QUESTION_STATUS = { OPEN: 'OPEN', ANSWERED: 'ANSWERED' } as const
export const CHOICE_ID = { A: 'a', B: 'b', C: 'c' } as const
export const CHOICE_IDS = Object.values(CHOICE_ID)
export const SCENARIO_IDS = [1, 2, 3, 4, 5] as const

export const MULTIPLAYER_CONFIG = {
  totalQuestions: SCENARIO_IDS.length,
  maxRoomPlayers: 100,
  minNicknameLength: 2,
  maxNicknameLength: 20,
  roomCodeLength: 4,
  roomCodePrefix: 'OT-',
  roomCodeAlphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  sessionFreshnessMs: 60_000,
  createRoomAttempts: 5,
} as const

export const HTTP_STATUS = { BAD_REQUEST: 400, UNAUTHORIZED: 401, CONFLICT: 409, INTERNAL_ERROR: 500 } as const
export const ERROR_CODE = {
  UNKNOWN_OPERATION: 'UNKNOWN_OPERATION',
  UNSUPPORTED_API_VERSION: 'UNSUPPORTED_API_VERSION',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_NOT_ACTIVE: 'ROOM_NOT_ACTIVE',
  ROOM_FULL: 'ROOM_FULL',
  ROOM_CREATE_FAILED: 'ROOM_CREATE_FAILED',
  INVALID_SCENARIO: 'INVALID_SCENARIO',
  INVALID_CHOICE: 'INVALID_CHOICE',
  INVALID_NICKNAME: 'INVALID_NICKNAME',
  PARTICIPANT_NOT_AUTHORIZED: 'PARTICIPANT_NOT_AUTHORIZED',
  PRESENTER_NOT_AUTHORIZED: 'PRESENTER_NOT_AUTHORIZED',
} as const
