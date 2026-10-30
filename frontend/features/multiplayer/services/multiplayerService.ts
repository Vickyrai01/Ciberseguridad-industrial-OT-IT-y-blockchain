import type { AnswerResult, ParticipantSession, RoomSnapshot } from '../types'
import { createSupabaseHttpClient } from './adapters/supabaseHttpClient'
import { createSupabaseRealtimeClient } from './adapters/supabaseRealtimeClient'
import { multiplayerSessionStorage } from './storage/multiplayerSessionStorage'
import { MULTIPLAYER_OPERATION } from '../constants'

const httpClient = createSupabaseHttpClient()
const realtimeClient = createSupabaseRealtimeClient()

export interface MultiplayerService {
  isConfigured(): boolean
  createRoom(): Promise<ParticipantSession>
  joinRoom(code: string, nickname: string): Promise<ParticipantSession>
  leaveRoom(participantToken: string): Promise<void>
  resumeParticipant(participantToken: string): Promise<ParticipantSession>
  getRoom(roomId: string, participantToken?: string, presenterToken?: string): Promise<RoomSnapshot>
  startRoom(roomId: string, presenterToken: string): Promise<RoomSnapshot>
  cancelRoom(roomId: string, presenterToken: string): Promise<RoomSnapshot>
  openQuestion(participantToken: string, scenarioId: number): Promise<{ openedAt: string }>
  submitAnswer(participantToken: string, scenarioId: number, choiceId: string): Promise<AnswerResult>
  advanceQuestion(roomId: string, presenterToken: string): Promise<RoomSnapshot>
  finishRoom(roomId: string, presenterToken: string): Promise<RoomSnapshot>
  getLeaderboard(
    roomId: string,
    participantToken?: string,
    presenterToken?: string,
  ): Promise<Pick<RoomSnapshot, 'leaderboard'>>
  saveSession(session: ParticipantSession): void
  loadSession(): ParticipantSession | null
  clearSession(): void
  subscribeToRoom(roomId: string, onRoomUpdated: () => void): () => void
}

export const multiplayerService: MultiplayerService = {
  isConfigured: httpClient.isConfigured,
  createRoom: () => httpClient.request<ParticipantSession>(MULTIPLAYER_OPERATION.CREATE_ROOM),
  joinRoom: (code, nickname) =>
    httpClient.request<ParticipantSession>(MULTIPLAYER_OPERATION.JOIN_ROOM, { code, nickname }),
  leaveRoom: (participantToken) =>
    httpClient.request<void>(MULTIPLAYER_OPERATION.LEAVE_ROOM, { participantToken }, true),
  resumeParticipant: (participantToken) =>
    httpClient.request<ParticipantSession>(MULTIPLAYER_OPERATION.RESUME_PARTICIPANT, { participantToken }),
  getRoom: (roomId, participantToken, presenterToken) =>
    httpClient.request<RoomSnapshot>(MULTIPLAYER_OPERATION.GET_ROOM, { roomId, participantToken, presenterToken }),
  startRoom: (roomId, presenterToken) =>
    httpClient.request<RoomSnapshot>(MULTIPLAYER_OPERATION.START_ROOM, { roomId, presenterToken }),
  cancelRoom: (roomId, presenterToken) =>
    httpClient.request<RoomSnapshot>(MULTIPLAYER_OPERATION.CANCEL_ROOM, { roomId, presenterToken }),
  openQuestion: (participantToken, scenarioId) =>
    httpClient.request<{ openedAt: string }>(MULTIPLAYER_OPERATION.OPEN_QUESTION, { participantToken, scenarioId }),
  submitAnswer: (participantToken, scenarioId, choiceId) =>
    httpClient.request<AnswerResult>(MULTIPLAYER_OPERATION.SUBMIT_ANSWER, { participantToken, scenarioId, choiceId }),
  advanceQuestion: (roomId, presenterToken) =>
    httpClient.request<RoomSnapshot>(MULTIPLAYER_OPERATION.ADVANCE_QUESTION, { roomId, presenterToken }),
  finishRoom: (roomId, presenterToken) =>
    httpClient.request<RoomSnapshot>(MULTIPLAYER_OPERATION.FINISH_ROOM, { roomId, presenterToken }),
  getLeaderboard: (roomId, participantToken, presenterToken) =>
    httpClient.request<Pick<RoomSnapshot, 'leaderboard'>>(MULTIPLAYER_OPERATION.GET_LEADERBOARD, {
      roomId,
      participantToken,
      presenterToken,
    }),
  saveSession: multiplayerSessionStorage.save,
  loadSession: multiplayerSessionStorage.load,
  clearSession: multiplayerSessionStorage.clear,
  subscribeToRoom: realtimeClient.subscribeToRoom,
}
