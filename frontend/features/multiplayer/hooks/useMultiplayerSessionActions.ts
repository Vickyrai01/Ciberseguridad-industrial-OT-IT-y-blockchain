import { useCallback } from 'react'
import { multiplayerService } from '../services/multiplayerService'
import type { ParticipantSession } from '../types'
import type { MultiplayerAction, MultiplayerState } from './multiplayerReducer'
import { getMultiplayerErrorMessage, isInvalidSessionError } from './useMultiplayerRequest'

interface SessionActionsOptions {
  state: MultiplayerState
  dispatch: (action: MultiplayerAction) => void
  run: <T>(action: () => Promise<T>, onSuccess: (result: T) => void) => Promise<void>
}

export function useMultiplayerSessionActions({ state, dispatch, run }: SessionActionsOptions) {
  const saveSession = useCallback(
    (session: ParticipantSession) => {
      multiplayerService.saveSession(session)
      dispatch({ type: 'LOBBY', session })
    },
    [dispatch],
  )

  const createRoom = useCallback(() => void run(multiplayerService.createRoom, saveSession), [run, saveSession])

  const joinRoom = useCallback(
    (code: string, nickname: string) => void run(() => multiplayerService.joinRoom(code, nickname), saveSession),
    [run, saveSession],
  )

  const resume = useCallback(async () => {
    const storedSession = multiplayerService.loadSession()
    if (!storedSession) return

    dispatch({ type: 'LOADING', value: true })
    try {
      const session = storedSession.presenterToken
        ? {
            ...storedSession,
            room: await multiplayerService.getRoom(storedSession.room.id, undefined, storedSession.presenterToken),
          }
        : await multiplayerService.resumeParticipant(storedSession.participantToken)
      saveSession(session)
    } catch (error) {
      const message = getMultiplayerErrorMessage(error)
      if (isInvalidSessionError(message)) {
        multiplayerService.clearSession()
        dispatch({ type: 'RESET' })
      } else {
        dispatch({ type: 'ERROR', message })
      }
    } finally {
      dispatch({ type: 'LOADING', value: false })
    }
  }, [dispatch, saveSession])

  const enter = useCallback(() => dispatch({ type: 'ENTRY' }), [dispatch])

  const reset = useCallback(() => {
    const participantToken = state.session?.presenterToken ? null : state.session?.participantToken
    if (participantToken) void multiplayerService.leaveRoom(participantToken)
    dispatch({ type: 'RESET' })
  }, [dispatch, state.session])

  return { createRoom, joinRoom, resume, enter, reset }
}
