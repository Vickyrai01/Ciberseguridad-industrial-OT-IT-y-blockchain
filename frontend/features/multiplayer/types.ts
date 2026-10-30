import type { ParticipantStatus, RoomStatus } from './constants'
export type { ParticipantStatus, RoomStatus } from './constants'

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

export interface RoomSnapshot {
  id: string
  code: string
  status: RoomStatus
  quizVersion: string
  maxPlayers: number
  scenarioOrder: number[]
  currentQuestionIndex: number
  participants: Array<{
    id: string
    nickname: string
    status: ParticipantStatus
    connected: boolean
  }>
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
