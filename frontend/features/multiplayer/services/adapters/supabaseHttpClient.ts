import { MULTIPLAYER_CONFIG } from '../../constants'
import type {
  MultiplayerOperation,
  MultiplayerRequestBodyByOperation,
  MultiplayerResponseByOperation,
} from '../../../../../shared/multiplayer/contracts'
import { MULTIPLAYER_API_ERROR, MultiplayerApiError } from '../apiErrors'
import { readSupabasePublicConfig } from '../supabaseConfig'

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

function normalizeResponse(value: unknown): unknown {
  if (!isRecord(value)) return value
  if ('room' in value) return { ...value, room: normalizeRoomSnapshot(value.room) }
  if ('code' in value) return normalizeRoomSnapshot(value)
  return value
}

async function readPayload(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new MultiplayerApiError(MULTIPLAYER_API_ERROR.INVALID_RESPONSE, 502)
  }
}

export function createSupabaseHttpClient() {
  const config = readSupabasePublicConfig()

  return {
    isConfigured: () => config !== null,
    request: async <Operation extends MultiplayerOperation>(
      operation: Operation,
      body: MultiplayerRequestBodyByOperation[Operation],
      parser: (value: unknown) => MultiplayerResponseByOperation[Operation],
      keepalive = false,
    ): Promise<MultiplayerResponseByOperation[Operation]> => {
      if (!config) throw new MultiplayerApiError('MULTIPLAYER_NOT_CONFIGURED')
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), MULTIPLAYER_CONFIG.requestTimeoutMs)
      try {
        const response = await fetch(`${config.url}/functions/v1/multiplayer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: config.publishableKey },
          keepalive,
          signal: controller.signal,
          body: JSON.stringify({ version: MULTIPLAYER_CONFIG.apiVersion, operation, ...body }),
        })
        const payload = await readPayload(response)
        if (!response.ok) {
          const errorPayload = isRecord(payload) ? (payload as ApiErrorPayload) : {}
          throw new MultiplayerApiError(
            errorPayload.error?.code ?? MULTIPLAYER_API_ERROR.REQUEST_FAILED,
            response.status,
            errorPayload.error?.message,
          )
        }
        return parser(normalizeResponse(payload))
      } catch (error) {
        if (error instanceof MultiplayerApiError) throw error
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new MultiplayerApiError(MULTIPLAYER_API_ERROR.TIMEOUT, 408)
        }
        throw new MultiplayerApiError(MULTIPLAYER_API_ERROR.NETWORK)
      } finally {
        window.clearTimeout(timeoutId)
      }
    },
  }
}
