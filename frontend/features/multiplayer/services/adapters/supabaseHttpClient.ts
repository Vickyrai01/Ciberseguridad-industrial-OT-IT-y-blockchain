import { readSupabasePublicConfig } from '../supabaseConfig'
import { MULTIPLAYER_CONFIG } from '../../constants'

interface ApiErrorPayload {
  error?: { code?: string; message?: string }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeRoomSnapshot(value: unknown): unknown {
  if (!isRecord(value) || typeof value.code !== 'string') return value
  return {
    ...value,
    quizVersion: value.quizVersion ?? value.quiz_version,
    maxPlayers: value.maxPlayers ?? value.max_players,
    scenarioOrder: value.scenarioOrder ?? value.scenario_order,
    currentQuestionIndex: Number(value.currentQuestionIndex ?? value.current_question_index ?? 0),
  }
}

function normalizeResponse<T>(value: T): T {
  if (!isRecord(value)) return value
  if ('room' in value) return { ...value, room: normalizeRoomSnapshot(value.room) } as T
  if ('code' in value) return normalizeRoomSnapshot(value) as T
  return value
}

export function createSupabaseHttpClient() {
  const config = readSupabasePublicConfig()

  return {
    isConfigured: () => config !== null,
    request: async <T>(operation: string, body: Record<string, unknown> = {}, keepalive = false): Promise<T> => {
      if (!config) throw new Error('MULTIPLAYER_NOT_CONFIGURED')
      const response = await fetch(`${config.url}/functions/v1/multiplayer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: config.publishableKey },
        keepalive,
        body: JSON.stringify({ version: MULTIPLAYER_CONFIG.apiVersion, operation, ...body }),
      })
      const payload = (await response.json()) as T & ApiErrorPayload
      if (!response.ok) throw new Error(payload.error?.code ?? 'MULTIPLAYER_REQUEST_FAILED')
      return normalizeResponse(payload)
    },
  }
}
