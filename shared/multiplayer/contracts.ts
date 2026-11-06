export const API_VERSION = 'v1' as const
export type ApiVersion = typeof API_VERSION

export const MULTIPLAYER_OPERATION = {
  CREATE_ROOM: 'createRoom',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
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
export type MultiplayerOperation = (typeof MULTIPLAYER_OPERATION)[keyof typeof MULTIPLAYER_OPERATION]

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

export const CHOICE_ID = { A: 'a', B: 'b', C: 'c' } as const
export const CHOICE_IDS = Object.values(CHOICE_ID)
export type ChoiceId = (typeof CHOICE_IDS)[number]

export const SCENARIO_IDS = [1, 2, 3, 4, 5] as const
export type ScenarioId = (typeof SCENARIO_IDS)[number]

export interface LeaderboardEntry {
  position: number
  participantId: string
  nickname: string
  score: number
  completedQuestions: number
  totalQuestions: number
  status: ParticipantStatus
  totalResponseTimeMs: number
  isCurrentParticipant: boolean
}

export interface RoomParticipant {
  id: string
  nickname: string
  status: ParticipantStatus
  connected: boolean
}

export interface RoomSnapshot {
  id: string
  code: string
  status: RoomStatus
  quizVersion: string
  maxPlayers: number
  scenarioOrder: number[]
  currentQuestionIndex: number
  participants: RoomParticipant[]
  leaderboard: LeaderboardEntry[]
}

export interface ParticipantSession {
  room: RoomSnapshot
  participantId: string
  participantToken: string
  presenterToken?: string
  scenarioOrder: number[]
}

export interface AnswerResult {
  accepted: boolean
  isCorrect: boolean
  awardedPoints: number
  score: number
  completedQuestions: number
  nextScenarioId: number | null
}

export interface OpenedQuestion {
  openedAt: string
}

export interface MultiplayerRequestBodyByOperation {
  createRoom: Record<string, never>
  joinRoom: { code: string; nickname: string }
  leaveRoom: { participantToken: string }
  resumeParticipant: { participantToken: string }
  getRoom: { roomId: string; participantToken?: string; presenterToken?: string }
  startRoom: { roomId: string; presenterToken: string }
  cancelRoom: { roomId: string; presenterToken: string }
  openQuestion: { participantToken: string; scenarioId: number }
  submitAnswer: { participantToken: string; scenarioId: number; choiceId: ChoiceId }
  advanceQuestion: { roomId: string; presenterToken: string }
  finishRoom: { roomId: string; presenterToken: string }
  getLeaderboard: { roomId: string; participantToken?: string; presenterToken?: string }
}

export interface MultiplayerResponseByOperation {
  createRoom: ParticipantSession
  joinRoom: ParticipantSession
  leaveRoom: void
  resumeParticipant: ParticipantSession
  getRoom: RoomSnapshot
  startRoom: RoomSnapshot
  cancelRoom: RoomSnapshot
  openQuestion: OpenedQuestion
  submitAnswer: AnswerResult
  advanceQuestion: RoomSnapshot
  finishRoom: RoomSnapshot
  getLeaderboard: Pick<RoomSnapshot, 'leaderboard'>
}

export type MultiplayerRequest = {
  [Operation in MultiplayerOperation]: {
    version: ApiVersion
    operation: Operation
  } & MultiplayerRequestBodyByOperation[Operation]
}[MultiplayerOperation]
