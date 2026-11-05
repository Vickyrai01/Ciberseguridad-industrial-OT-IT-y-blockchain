import { useCallback } from 'react'
import type { MultiplayerAction } from './multiplayerReducer'

export function getMultiplayerErrorMessage(error: unknown, fallback = 'MULTIPLAYER_REQUEST_FAILED'): string {
  return error instanceof Error ? error.message : fallback
}

export function isInvalidSessionError(message: string): boolean {
  return message === 'PARTICIPANT_NOT_AUTHORIZED' || message === 'ROOM_NOT_FOUND'
}

export function useMultiplayerRequest(dispatch: (action: MultiplayerAction) => void) {
  return useCallback(
    async <T>(action: () => Promise<T>, onSuccess: (result: T) => void) => {
      dispatch({ type: 'LOADING', value: true })
      try {
        onSuccess(await action())
      } catch (error) {
        dispatch({ type: 'ERROR', message: getMultiplayerErrorMessage(error) })
      } finally {
        dispatch({ type: 'LOADING', value: false })
      }
    },
    [dispatch],
  )
}
