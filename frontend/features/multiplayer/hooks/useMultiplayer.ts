import { useCallback, useEffect, useReducer } from 'react'
import { multiplayerService } from '../services/multiplayerService'
import type { AnswerResult, ParticipantSession, RoomSnapshot } from '../types'
import { MULTIPLAYER_MODE, type MultiplayerMode } from '../constants'

interface State {
  mode: MultiplayerMode
  session: ParticipantSession | null
  room: RoomSnapshot | null
  error: string | null
  loading: boolean
}
type Action =
  | { type: 'ENTRY' }
  | { type: 'LOBBY'; session: ParticipantSession }
  | { type: 'ROOM'; room: RoomSnapshot }
  | { type: 'PLAYING'; room: RoomSnapshot }
  | { type: 'FINISHED'; room: RoomSnapshot }
  | { type: 'LOADING'; value: boolean }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET' }
const initialState: State = { mode: MULTIPLAYER_MODE.IDLE, session: null, room: null, error: null, loading: false }
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ENTRY':
      return { ...state, mode: MULTIPLAYER_MODE.ENTRY, error: null }
    case 'LOBBY':
      return { ...state, mode: MULTIPLAYER_MODE.LOBBY, session: action.session, room: action.session.room, error: null }
    case 'ROOM':
      return { ...state, room: action.room }
    case 'PLAYING':
      return { ...state, mode: MULTIPLAYER_MODE.PLAYING, room: action.room }
    case 'FINISHED':
      return { ...state, mode: MULTIPLAYER_MODE.FINISHED, room: action.room }
    case 'LOADING':
      return { ...state, loading: action.value }
    case 'ERROR':
      return {
        ...state,
        mode: state.session ? state.mode : MULTIPLAYER_MODE.ERROR,
        error: action.message,
        loading: false,
      }
    case 'RESET':
      multiplayerService.clearSession()
      return initialState
  }
}

export function useMultiplayer() {
  const [state, dispatch] = useReducer(reducer, initialState)
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
  const run = useCallback(async <T>(action: () => Promise<T>, onSuccess: (result: T) => void) => {
    dispatch({ type: 'LOADING', value: true })
    try {
      onSuccess(await action())
    } catch (error) {
      dispatch({ type: 'ERROR', message: error instanceof Error ? error.message : 'MULTIPLAYER_REQUEST_FAILED' })
    } finally {
      dispatch({ type: 'LOADING', value: false })
    }
  }, [])
  const createRoom = useCallback(
    () =>
      void run(multiplayerService.createRoom, (session) => {
        multiplayerService.saveSession(session)
        dispatch({ type: 'LOBBY', session })
      }),
    [run],
  )
  const joinRoom = useCallback(
    (code: string, nickname: string) =>
      void run(
        () => multiplayerService.joinRoom(code, nickname),
        (session) => {
          multiplayerService.saveSession(session)
          dispatch({ type: 'LOBBY', session })
        },
      ),
    [run],
  )
  const resume = useCallback(() => {
    const session = multiplayerService.loadSession()
    if (session) dispatch({ type: 'LOBBY', session })
  }, [])
  const startRoom = useCallback(
    () =>
      state.session?.presenterToken &&
      void run(
        () => multiplayerService.startRoom(state.session!.room.id, state.session!.presenterToken!),
        (room) => dispatch({ type: 'PLAYING', room }),
      ),
    [run, state.session],
  )
  const startPlayer = useCallback(
    () =>
      state.session &&
      void run(
        () => multiplayerService.getRoom(state.session!.room.id, state.session!.participantToken),
        (room) => dispatch({ type: 'PLAYING', room }),
      ),
    [run, state.session],
  )
  const submitAnswer = useCallback(
    async (scenarioId: number, choiceId: string): Promise<AnswerResult> => {
      if (!state.session) throw new Error('PARTICIPANT_SESSION_MISSING')
      const result = await multiplayerService.submitAnswer(state.session.participantToken, scenarioId, choiceId)
      void refresh()
      return result
    },
    [refresh, state.session],
  )
  const openQuestion = useCallback(
    (scenarioId: number) => {
      if (!state.session) return
      void multiplayerService
        .openQuestion(state.session.participantToken, scenarioId)
        .catch((error: unknown) =>
          dispatch({ type: 'ERROR', message: error instanceof Error ? error.message : 'QUESTION_OPEN_FAILED' }),
        )
    },
    [state.session],
  )
  const finishRoom = useCallback(
    () =>
      state.session?.presenterToken &&
      void run(
        () => multiplayerService.finishRoom(state.session!.room.id, state.session!.presenterToken!),
        (room) => dispatch({ type: 'FINISHED', room }),
      ),
    [run, state.session],
  )
  const enter = useCallback(() => dispatch({ type: 'ENTRY' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])
  return {
    ...state,
    configured: multiplayerService.isConfigured(),
    scenarioOrder: state.session?.scenarioOrder ?? [],
    createRoom,
    joinRoom,
    resume,
    startRoom,
    startPlayer,
    openQuestion,
    submitAnswer,
    finishRoom,
    enter,
    reset,
    refresh,
  }
}
