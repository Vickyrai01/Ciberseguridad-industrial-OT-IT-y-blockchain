import { multiplayerService } from '../services/multiplayerService'
import type { ParticipantSession, RoomSnapshot } from '../types'
import { MULTIPLAYER_MODE, ROOM_STATUS, type MultiplayerMode } from '../constants'

export interface MultiplayerState {
  mode: MultiplayerMode
  session: ParticipantSession | null
  room: RoomSnapshot | null
  error: string | null
  loading: boolean
}

export type MultiplayerAction =
  | { type: 'ENTRY' }
  | { type: 'LOBBY'; session: ParticipantSession }
  | { type: 'ROOM'; room: RoomSnapshot }
  | { type: 'PLAYING'; room: RoomSnapshot }
  | { type: 'FINISHED'; room: RoomSnapshot }
  | { type: 'LOADING'; value: boolean }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET' }

export const initialMultiplayerState: MultiplayerState = {
  mode: MULTIPLAYER_MODE.IDLE,
  session: null,
  room: null,
  error: null,
  loading: false,
}

export function multiplayerReducer(state: MultiplayerState, action: MultiplayerAction): MultiplayerState {
  switch (action.type) {
    case 'ENTRY':
      return { ...state, mode: MULTIPLAYER_MODE.ENTRY, error: null }
    case 'LOBBY':
      return { ...state, mode: MULTIPLAYER_MODE.LOBBY, session: action.session, room: action.session.room, error: null }
    case 'ROOM':
      return {
        ...state,
        room: action.room,
        mode: action.room.status === ROOM_STATUS.FINISHED ? MULTIPLAYER_MODE.FINISHED : state.mode,
      }
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
      return initialMultiplayerState
  }
}
