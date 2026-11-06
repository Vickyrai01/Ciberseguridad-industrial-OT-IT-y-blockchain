import { PARTICIPANT_STATUS, ROOM_STATUS } from '../constants'
import type { AnswerResult, LeaderboardEntry, ParticipantSession, RoomSnapshot } from '../types'
import { MULTIPLAYER_API_ERROR, MultiplayerApiError } from './apiErrors'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function invalidResponse(): never {
  throw new MultiplayerApiError(MULTIPLAYER_API_ERROR.INVALID_RESPONSE, 502)
}

function stringValue(value: unknown): string {
  if (typeof value !== 'string' || !value) return invalidResponse()
  return value
}

function stringValueAllowEmpty(value: unknown): string {
  if (typeof value !== 'string') return invalidResponse()
  return value
}

function numberValue(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return invalidResponse()
  return value
}

function integerValue(value: unknown): number {
  const number = numberValue(value)
  if (!Number.isInteger(number)) return invalidResponse()
  return number
}

function booleanValue(value: unknown): boolean {
  if (typeof value !== 'boolean') return invalidResponse()
  return value
}

function arrayValue(value: unknown): unknown[] {
  if (!Array.isArray(value)) return invalidResponse()
  return value
}

function isRoomStatus(value: unknown): value is RoomSnapshot['status'] {
  return Object.values(ROOM_STATUS).includes(value as RoomSnapshot['status'])
}

function isParticipantStatus(value: unknown): value is LeaderboardEntry['status'] {
  return Object.values(PARTICIPANT_STATUS).includes(value as LeaderboardEntry['status'])
}

function parseLeaderboardEntry(value: unknown): LeaderboardEntry {
  if (!isRecord(value) || !isParticipantStatus(value.status)) return invalidResponse()
  return {
    position: integerValue(value.position),
    participantId: stringValue(value.participantId),
    nickname: stringValue(value.nickname),
    score: numberValue(value.score),
    completedQuestions: integerValue(value.completedQuestions),
    totalQuestions: integerValue(value.totalQuestions),
    status: value.status,
    totalResponseTimeMs: numberValue(value.totalResponseTimeMs),
    isCurrentParticipant: booleanValue(value.isCurrentParticipant),
  }
}

function parseParticipant(value: unknown): RoomSnapshot['participants'][number] {
  if (!isRecord(value) || !isParticipantStatus(value.status)) return invalidResponse()
  return {
    id: stringValue(value.id),
    nickname: stringValue(value.nickname),
    status: value.status,
    connected: booleanValue(value.connected),
  }
}

export function parseRoomSnapshot(value: unknown): RoomSnapshot {
  if (!isRecord(value) || !isRoomStatus(value.status)) return invalidResponse()
  return {
    id: stringValue(value.id),
    code: stringValue(value.code),
    status: value.status,
    quizVersion: stringValue(value.quizVersion),
    maxPlayers: integerValue(value.maxPlayers),
    scenarioOrder: arrayValue(value.scenarioOrder).map(integerValue),
    currentQuestionIndex: integerValue(value.currentQuestionIndex),
    participants: arrayValue(value.participants).map(parseParticipant),
    leaderboard: arrayValue(value.leaderboard).map(parseLeaderboardEntry),
  }
}

export function parseParticipantSession(value: unknown): ParticipantSession {
  if (!isRecord(value)) return invalidResponse()
  const session: ParticipantSession = {
    room: parseRoomSnapshot(value.room),
    participantId: stringValueAllowEmpty(value.participantId),
    participantToken: stringValueAllowEmpty(value.participantToken),
    scenarioOrder: arrayValue(value.scenarioOrder).map(integerValue),
  }
  if (value.presenterToken !== undefined) session.presenterToken = stringValue(value.presenterToken)
  return session
}

export function parseAnswerResult(value: unknown): AnswerResult {
  if (!isRecord(value)) return invalidResponse()
  const nextScenarioId = value.nextScenarioId
  if (nextScenarioId !== null && typeof nextScenarioId !== 'number') return invalidResponse()
  return {
    accepted: booleanValue(value.accepted),
    isCorrect: booleanValue(value.isCorrect),
    awardedPoints: numberValue(value.awardedPoints),
    score: numberValue(value.score),
    completedQuestions: integerValue(value.completedQuestions),
    nextScenarioId,
  }
}

export function parseOpenedQuestion(value: unknown): { openedAt: string } {
  if (!isRecord(value)) return invalidResponse()
  return { openedAt: stringValue(value.openedAt) }
}

export function parseLeaderboard(value: unknown): Pick<RoomSnapshot, 'leaderboard'> {
  if (!isRecord(value)) return invalidResponse()
  return { leaderboard: arrayValue(value.leaderboard).map(parseLeaderboardEntry) }
}

export function parseVoid(): void {
  return undefined
}
