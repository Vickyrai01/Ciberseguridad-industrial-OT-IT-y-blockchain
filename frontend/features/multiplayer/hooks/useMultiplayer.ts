import { useCallback, useEffect, useReducer } from 'react'
import { MULTIPLAYER_CONFIG, MULTIPLAYER_CONNECTION_STATUS, REALTIME_SUBSCRIPTION_STATUS } from '../constants'
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
    const unsubscribe = multiplayerService.subscribeToRoom(
      state.session.room.id,
      () => void refresh(),
      (status) => {
        const connectionStatus =
          status === REALTIME_SUBSCRIPTION_STATUS.SUBSCRIBED
            ? MULTIPLAYER_CONNECTION_STATUS.CONNECTED
            : MULTIPLAYER_CONNECTION_STATUS.DISCONNECTED
        dispatch({ type: 'CONNECTION', status: connectionStatus })
        if (status === REALTIME_SUBSCRIPTION_STATUS.SUBSCRIBED) void refresh()
      },
    )
    return unsubscribe
  }, [refresh, state.session])

  useEffect(() => {
    if (!state.session || state.session.presenterToken) return
    const heartbeat = window.setInterval(() => {
      if (navigator.onLine) void refresh()
    }, MULTIPLAYER_CONFIG.heartbeatIntervalMs)
    return () => window.clearInterval(heartbeat)
  }, [refresh, state.session])

  useEffect(() => {
    if (!state.session) return
    const handleOnline = () => {
      dispatch({ type: 'CONNECTION', status: MULTIPLAYER_CONNECTION_STATUS.CONNECTING })
      void refresh()
    }
    const handleOffline = () => dispatch({ type: 'CONNECTION', status: MULTIPLAYER_CONNECTION_STATUS.DISCONNECTED })
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      dispatch({ type: 'CONNECTION', status: MULTIPLAYER_CONNECTION_STATUS.CONNECTING })
      void refresh()
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
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
