import { useCallback } from 'react'
import { multiplayerService } from '../services/multiplayerService'
import type { MultiplayerAction, MultiplayerState } from './multiplayerReducer'

interface RoomActionsOptions {
  state: MultiplayerState
  dispatch: (action: MultiplayerAction) => void
  run: <T>(action: () => Promise<T>, onSuccess: (result: T) => void) => Promise<void>
}

export function useMultiplayerRoomActions({ state, dispatch, run }: RoomActionsOptions) {
  const startRoom = useCallback(() => {
    const session = state.session
    if (!session?.presenterToken) return
    const presenterToken = session.presenterToken
    void run(
      () => multiplayerService.startRoom(session.room.id, presenterToken),
      (room) => dispatch({ type: 'PLAYING', room }),
    )
  }, [dispatch, run, state.session])

  const startPlayer = useCallback(() => {
    const session = state.session
    if (!session) return
    void run(
      () => multiplayerService.getRoom(session.room.id, session.participantToken),
      (room) => dispatch({ type: 'PLAYING', room }),
    )
  }, [dispatch, run, state.session])

  const finishRoom = useCallback(() => {
    const session = state.session
    if (!session?.presenterToken) return
    const presenterToken = session.presenterToken
    void run(
      () => multiplayerService.finishRoom(session.room.id, presenterToken),
      (room) => dispatch({ type: 'FINISHED', room }),
    )
  }, [dispatch, run, state.session])

  const advanceQuestion = useCallback(() => {
    const session = state.session
    if (!session?.presenterToken) return
    const presenterToken = session.presenterToken
    void run(
      () => multiplayerService.advanceQuestion(session.room.id, presenterToken),
      (room) => dispatch({ type: 'ROOM', room }),
    )
  }, [dispatch, run, state.session])

  return { startRoom, startPlayer, finishRoom, advanceQuestion }
}
