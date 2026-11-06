export const MULTIPLAYER_API_ERROR = {
  NETWORK: 'MULTIPLAYER_NETWORK_ERROR',
  TIMEOUT: 'MULTIPLAYER_REQUEST_TIMEOUT',
  INVALID_RESPONSE: 'MULTIPLAYER_INVALID_RESPONSE',
  REQUEST_FAILED: 'MULTIPLAYER_REQUEST_FAILED',
} as const

export class MultiplayerApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status?: number,
    message?: string,
  ) {
    super(message ?? code)
    this.name = 'MultiplayerApiError'
  }
}

export function getMultiplayerErrorCode(error: unknown): string {
  if (error instanceof MultiplayerApiError) return error.code
  if (error instanceof Error && error.message) return error.message
  return MULTIPLAYER_API_ERROR.REQUEST_FAILED
}
