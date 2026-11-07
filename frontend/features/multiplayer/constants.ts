import { MULTIPLAYER_SHARED_CONFIG } from '../../../shared/multiplayer/contracts'

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

export { MULTIPLAYER_SHARED_CONFIG }

export const MULTIPLAYER_CONFIG = {
  ...MULTIPLAYER_SHARED_CONFIG,
  roomCodeMinLength: MULTIPLAYER_SHARED_CONFIG.roomCodeLength,
  roomCodeMaxLength: MULTIPLAYER_SHARED_CONFIG.roomCodePrefix.length + MULTIPLAYER_SHARED_CONFIG.roomCodeLength,
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

export const MULTIPLAYER_CONNECTION_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
} as const
export type MultiplayerConnectionStatus =
  (typeof MULTIPLAYER_CONNECTION_STATUS)[keyof typeof MULTIPLAYER_CONNECTION_STATUS]

export const REALTIME_SUBSCRIPTION_STATUS = {
  SUBSCRIBED: 'SUBSCRIBED',
  DISCONNECTED: 'DISCONNECTED',
} as const
