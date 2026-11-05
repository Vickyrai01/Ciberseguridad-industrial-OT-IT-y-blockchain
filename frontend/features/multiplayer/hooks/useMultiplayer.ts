import { useCallback, useEffect, useReducer } from 'react'
import { multiplayerService } from '../services/multiplayerService'
import { initialMultiplayerState, multiplayerReducer } from './multiplayerReducer'
import { useMultiplayerParticipantActions } from './useMultiplayerParticipantActions'
import { useMultiplayerRequest } from './useMultiplayerRequest'
import { useMultiplayerRoomActions } from './useMultiplayerRoomActions'
import { useMultiplayerSessionActions } from './useMultiplayerSessionActions'

export function useMultiplayer() {
  const [state, dispatch] = useReducer(multiplayerReducer, initialMultiplayerState)

  const refresh = useCallback(async () => {
    if (!state.session) return
    try {
      const room = await multiplayerService.getRoom(
        state.session.room.id,
        state.session.participantToken,
        state.session.presenterToken,
      )
      dispatch({ type: 'ROOM', room })
    } catch (error) {
      dispatch({ type: 'ERROR', message: error instanceof Error ? error.message : 'MULTIPLAYER_REQUEST_FAILED' })
    }
  }, [state.session])

  useEffect(() => {
    if (!state.session) return
    const unsubscribe = multiplayerService.subscribeToRoom(state.session.room.id, () => {
      void refresh()
    })
    return unsubscribe
  }, [refresh, state.session])

  useEffect(() => {
    const participantToken = state.session?.presenterToken ? null : state.session?.participantToken
    if (!participantToken) return
    const leaveRoom = () => void multiplayerService.leaveRoom(participantToken)
    window.addEventListener('pagehide', leaveRoom)
    return () => window.removeEventListener('pagehide', leaveRoom)
  }, [state.session?.participantToken, state.session?.presenterToken])

  const run = useMultiplayerRequest(dispatch)
  const sessionActions = useMultiplayerSessionActions({ state, dispatch, run })
  const roomActions = useMultiplayerRoomActions({ state, dispatch, run })
  const participantActions = useMultiplayerParticipantActions({ state, dispatch, refresh })

  return {
    ...state,
    configured: multiplayerService.isConfigured(),
    scenarioOrder: state.session?.scenarioOrder ?? [],
    ...sessionActions,
    ...roomActions,
    ...participantActions,
    refresh,
  }
}
