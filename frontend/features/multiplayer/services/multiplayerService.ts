import type { AnswerResult, ParticipantSession, RoomSnapshot } from '../types'
import { createSupabaseHttpClient } from './adapters/supabaseHttpClient'
import { createSupabaseRealtimeClient } from './adapters/supabaseRealtimeClient'
import type { RealtimeConnectionStatus } from './adapters/supabaseRealtimeClient'
import { multiplayerSessionStorage } from './storage/multiplayerSessionStorage'
import { MULTIPLAYER_OPERATION } from '../constants'
import type { ChoiceId as MultiplayerChoiceId } from '../../../../shared/multiplayer/contracts'
import {
  parseAnswerResult,
  parseLeaderboard,
  parseOpenedQuestion,
  parseParticipantSession,
  parseRoomSnapshot,
  parseVoid,
} from './apiContracts'

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
  submitAnswer(participantToken: string, scenarioId: number, choiceId: MultiplayerChoiceId): Promise<AnswerResult>
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
  subscribeToRoom(
    roomId: string,
    onRoomUpdated: () => void,
    onStatusChanged?: (status: RealtimeConnectionStatus) => void,
  ): () => void
}

export const multiplayerService: MultiplayerService = {
  isConfigured: httpClient.isConfigured,
  createRoom: () => httpClient.request(MULTIPLAYER_OPERATION.CREATE_ROOM, {}, parseParticipantSession),
  joinRoom: (code, nickname) =>
    httpClient.request(MULTIPLAYER_OPERATION.JOIN_ROOM, { code, nickname }, parseParticipantSession),
  leaveRoom: (participantToken) =>
    httpClient.request(MULTIPLAYER_OPERATION.LEAVE_ROOM, { participantToken }, parseVoid, true),
  resumeParticipant: (participantToken) =>
    httpClient.request(MULTIPLAYER_OPERATION.RESUME_PARTICIPANT, { participantToken }, parseParticipantSession),
  getRoom: (roomId, participantToken, presenterToken) =>
    httpClient.request(MULTIPLAYER_OPERATION.GET_ROOM, { roomId, participantToken, presenterToken }, parseRoomSnapshot),
  startRoom: (roomId, presenterToken) =>
    httpClient.request(MULTIPLAYER_OPERATION.START_ROOM, { roomId, presenterToken }, parseRoomSnapshot),
  cancelRoom: (roomId, presenterToken) =>
    httpClient.request(MULTIPLAYER_OPERATION.CANCEL_ROOM, { roomId, presenterToken }, parseRoomSnapshot),
  openQuestion: (participantToken, scenarioId) =>
    httpClient.request(MULTIPLAYER_OPERATION.OPEN_QUESTION, { participantToken, scenarioId }, parseOpenedQuestion),
  submitAnswer: (participantToken, scenarioId, choiceId) =>
    httpClient.request(
      MULTIPLAYER_OPERATION.SUBMIT_ANSWER,
      { participantToken, scenarioId, choiceId },
      parseAnswerResult,
    ),
  advanceQuestion: (roomId, presenterToken) =>
    httpClient.request(MULTIPLAYER_OPERATION.ADVANCE_QUESTION, { roomId, presenterToken }, parseRoomSnapshot),
  finishRoom: (roomId, presenterToken) =>
    httpClient.request(MULTIPLAYER_OPERATION.FINISH_ROOM, { roomId, presenterToken }, parseRoomSnapshot),
  getLeaderboard: (roomId, participantToken, presenterToken) =>
    httpClient.request(
      MULTIPLAYER_OPERATION.GET_LEADERBOARD,
      {
        roomId,
        participantToken,
        presenterToken,
      },
      parseLeaderboard,
    ),
  saveSession: multiplayerSessionStorage.save,
  loadSession: multiplayerSessionStorage.load,
  clearSession: multiplayerSessionStorage.clear,
  subscribeToRoom: realtimeClient.subscribeToRoom,
}
