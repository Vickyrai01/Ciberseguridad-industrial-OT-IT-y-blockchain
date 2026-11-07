import { useCallback } from 'react'
import type { MultiplayerAction } from './multiplayerReducer'
import { getMultiplayerErrorCode, MULTIPLAYER_SESSION_ERROR } from '../services/apiErrors'

export function getMultiplayerErrorMessage(error: unknown, fallback = 'MULTIPLAYER_REQUEST_FAILED'): string {
  return error instanceof Error ? getMultiplayerErrorCode(error) : fallback
}

export function isInvalidSessionError(message: string): boolean {
  return Object.values(MULTIPLAYER_SESSION_ERROR).includes(
    message as (typeof MULTIPLAYER_SESSION_ERROR)[keyof typeof MULTIPLAYER_SESSION_ERROR],
  )
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
