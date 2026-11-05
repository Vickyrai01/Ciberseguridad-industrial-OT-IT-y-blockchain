import type { ParticipantSession } from '../../types'
import { PARTICIPANT_STATUS, ROOM_STATUS } from '../../constants'

const SESSION_STORAGE_KEY = 'ot-under-attack-multiplayer-session'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isRoomSnapshot(value: unknown): boolean {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.code === 'string' &&
    Object.values(ROOM_STATUS).includes(value.status as (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS]) &&
    typeof value.quizVersion === 'string' &&
    typeof value.maxPlayers === 'number' &&
    Array.isArray(value.scenarioOrder) &&
    value.scenarioOrder.every((id) => Number.isInteger(id)) &&
    Number.isInteger(value.currentQuestionIndex) &&
    Array.isArray(value.participants) &&
    value.participants.every(isParticipant) &&
    Array.isArray(value.leaderboard) &&
    value.leaderboard.every(isLeaderboardEntry)
  )
}

function isParticipant(value: unknown): boolean {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.nickname === 'string' &&
    Object.values(PARTICIPANT_STATUS).includes(
      value.status as (typeof PARTICIPANT_STATUS)[keyof typeof PARTICIPANT_STATUS],
    ) &&
    typeof value.connected === 'boolean'
  )
}

function isLeaderboardEntry(value: unknown): boolean {
  if (!isRecord(value)) return false
  return (
    Number.isInteger(value.position) &&
    typeof value.participantId === 'string' &&
    typeof value.nickname === 'string' &&
    typeof value.score === 'number' &&
    Number.isInteger(value.completedQuestions) &&
    Number.isInteger(value.totalQuestions) &&
    Object.values(PARTICIPANT_STATUS).includes(
      value.status as (typeof PARTICIPANT_STATUS)[keyof typeof PARTICIPANT_STATUS],
    ) &&
    typeof value.totalResponseTimeMs === 'number' &&
    typeof value.isCurrentParticipant === 'boolean'
  )
}

function isParticipantSession(value: unknown): value is ParticipantSession {
  if (!isRecord(value) || !isRoomSnapshot(value.room)) return false
  if (typeof value.participantId !== 'string' || typeof value.participantToken !== 'string') return false
  if (!Array.isArray(value.scenarioOrder) || !value.scenarioOrder.every((id) => Number.isInteger(id))) return false

  return Boolean(value.participantToken || (typeof value.presenterToken === 'string' && value.presenterToken))
}

export const multiplayerSessionStorage = {
  save: (session: ParticipantSession): void => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    } catch {
      // Storage can be unavailable in private browsing or when quota is exceeded.
    }
  },
  load: (): ParticipantSession | null => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY)
      const parsed: unknown = raw ? JSON.parse(raw) : null
      return isParticipantSession(parsed) ? parsed : null
    } catch {
      return null
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // Storage can be unavailable in private browsing.
    }
  },
}
