import { TOTAL_QUESTIONS } from '../domain/rooms.ts'
import { findRoomById, listAnswerCounts, listParticipants } from '../repositories/roomRepository.ts'
import { MULTIPLAYER_CONFIG } from '../shared/constants.ts'

export async function getRoomView(roomId: string, currentParticipantId?: string) {
  const room = await findRoomById(roomId)
  const participants = await listParticipants(roomId)
  const completedCounts = await listAnswerCounts(roomId)
  const leaderboard = [...participants]
    .sort(
      (a, b) =>
        b.total_score - a.total_score ||
        a.total_response_time_ms - b.total_response_time_ms ||
        a.nickname.localeCompare(b.nickname),
    )
    .map((participant, index) => ({
      position: index + 1,
      participantId: participant.id,
      nickname: participant.nickname,
      score: participant.total_score,
      completedQuestions: completedCounts.get(participant.id) ?? 0,
      totalQuestions: TOTAL_QUESTIONS,
      status: participant.status,
      totalResponseTimeMs: participant.total_response_time_ms,
      isCurrentParticipant: participant.id === currentParticipantId,
    }))
  return {
    ...room,
    participants: participants.map((participant) => ({
      id: participant.id,
      nickname: participant.nickname,
      status: participant.status,
      connected: Date.now() - new Date(participant.last_seen_at).getTime() < MULTIPLAYER_CONFIG.sessionFreshnessMs,
    })),
    leaderboard,
  }
}
