import { describe, expect, it } from 'vitest'
import { MULTIPLAYER_API_ERROR, MultiplayerApiError } from './apiErrors'
import { parseAnswerResult, parseParticipantSession, parseRoomSnapshot } from './apiContracts'

const room = {
  id: 'room-id',
  code: 'ABCD',
  status: 'WAITING',
  quizVersion: 'v1',
  maxPlayers: 30,
  scenarioOrder: [1, 2, 3, 4, 5],
  currentQuestionIndex: 0,
  participants: [],
  leaderboard: [],
}

describe('multiplayer API contracts', () => {
  it('accepts a normalized room snapshot', () => {
    expect(parseRoomSnapshot(room)).toEqual(room)
  })

  it('allows the presenter-only session returned when creating a room', () => {
    expect(
      parseParticipantSession({
        room,
        participantId: '',
        participantToken: '',
        presenterToken: 'presenter-token',
        scenarioOrder: [1, 2, 3, 4, 5],
      }).participantToken,
    ).toBe('')
  })

  it('rejects an incomplete answer response', () => {
    expect(() => parseAnswerResult({ accepted: true })).toThrowError(
      new MultiplayerApiError(MULTIPLAYER_API_ERROR.INVALID_RESPONSE, 502),
    )
  })
})
