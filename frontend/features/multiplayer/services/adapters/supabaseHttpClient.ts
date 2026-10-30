import { readSupabasePublicConfig } from '../supabaseConfig'
import { MULTIPLAYER_CONFIG } from '../../constants'

interface ApiErrorPayload {
  error?: { code?: string; message?: string }
}

export function createSupabaseHttpClient() {
  const config = readSupabasePublicConfig()

  return {
    isConfigured: () => config !== null,
    request: async <T>(operation: string, body: Record<string, unknown> = {}): Promise<T> => {
      if (!config) throw new Error('MULTIPLAYER_NOT_CONFIGURED')
      const response = await fetch(`${config.url}/functions/v1/multiplayer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: config.publishableKey },
        body: JSON.stringify({ version: MULTIPLAYER_CONFIG.apiVersion, operation, ...body }),
      })
      const payload = (await response.json()) as T & ApiErrorPayload
      if (!response.ok) throw new Error(payload.error?.code ?? 'MULTIPLAYER_REQUEST_FAILED')
      return payload
    },
  }
}
