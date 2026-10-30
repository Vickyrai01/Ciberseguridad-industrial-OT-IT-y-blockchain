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
export type ParticipantStatus = (typeof PARTICIPANT_STATUS)[keyof typeof PARTICIPANT_STATUS]

export const MULTIPLAYER_OPERATION = {
  CREATE_ROOM: 'createRoom',
  JOIN_ROOM: 'joinRoom',
  RESUME_PARTICIPANT: 'resumeParticipant',
  GET_ROOM: 'getRoom',
  START_ROOM: 'startRoom',
  CANCEL_ROOM: 'cancelRoom',
  OPEN_QUESTION: 'openQuestion',
  SUBMIT_ANSWER: 'submitAnswer',
  ADVANCE_QUESTION: 'advanceQuestion',
  FINISH_ROOM: 'finishRoom',
  GET_LEADERBOARD: 'getLeaderboard',
} as const

export const MULTIPLAYER_CONFIG = {
  apiVersion: 'v1',
  roomCodeMinLength: 4,
  roomCodeMaxLength: 7,
  minNicknameLength: 2,
  maxNicknameLength: 20,
} as const
