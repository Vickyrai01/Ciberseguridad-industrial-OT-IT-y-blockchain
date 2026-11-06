export const MULTIPLAYER_MODE = {
  IDLE: 'idle',
  ENTRY: 'entry',
  LOBBY: 'lobby',
  PLAYING: 'playing',
  FINISHED: 'finished',
  ERROR: 'error',
} as const
export type MultiplayerMode = (typeof MULTIPLAYER_MODE)[keyof typeof MULTIPLAYER_MODE]

export const MULTIPLAYER_VIEW_MODES = [
  MULTIPLAYER_MODE.ENTRY,
  MULTIPLAYER_MODE.LOBBY,
  MULTIPLAYER_MODE.FINISHED,
  MULTIPLAYER_MODE.ERROR,
] as const
export type MultiplayerViewMode = (typeof MULTIPLAYER_VIEW_MODES)[number]

export const MULTIPLAYER_CONFIG = {
  apiVersion: 'v1',
  roomCodeMinLength: 4,
  roomCodeMaxLength: 7,
  minNicknameLength: 2,
  maxNicknameLength: 20,
  requestTimeoutMs: 10000,
} as const
import {
  MULTIPLAYER_OPERATION,
  PARTICIPANT_STATUS,
  ROOM_STATUS,
  type MultiplayerOperation,
  type ParticipantStatus,
  type RoomStatus,
} from '../../../shared/multiplayer/contracts'

export { MULTIPLAYER_OPERATION, PARTICIPANT_STATUS, ROOM_STATUS }
export type { MultiplayerOperation, ParticipantStatus, RoomStatus }
