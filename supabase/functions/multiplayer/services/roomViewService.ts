import { TOTAL_QUESTIONS } from '../domain/rooms.ts'
import { findRoomById, listAnswerCounts, listAnswerScores, listParticipants } from '../repositories/roomRepository.ts'
import { MULTIPLAYER_CONFIG } from '../shared/constants.ts'

export async function getRoomView(roomId: string, currentParticipantId?: string) {
  const room = await findRoomById(roomId)
  const participants = await listParticipants(roomId)
  const completedCounts = await listAnswerCounts(roomId)
  const answerScores = await listAnswerScores(roomId)
  const leaderboard = [...participants]
    .sort(
      (a, b) =>
        (answerScores.get(b.id) ?? b.total_score) - (answerScores.get(a.id) ?? a.total_score) ||
        a.total_response_time_ms - b.total_response_time_ms ||
        a.nickname.localeCompare(b.nickname),
    )
    .map((participant, index) => ({
      position: index + 1,
      participantId: participant.id,
      nickname: participant.nickname,
      score: answerScores.get(participant.id) ?? participant.total_score,
      completedQuestions: completedCounts.get(participant.id) ?? 0,
      totalQuestions: TOTAL_QUESTIONS,
      status: participant.status,
      totalResponseTimeMs: participant.total_response_time_ms,
      isCurrentParticipant: participant.id === currentParticipantId,
    }))
  return {
    ...room,
    current_question_index: room.current_question_index ?? 0,
    participants: participants.map((participant) => ({
      id: participant.id,
      nickname: participant.nickname,
      status: participant.status,
      connected: Date.now() - new Date(participant.last_seen_at).getTime() < MULTIPLAYER_CONFIG.sessionFreshnessMs,
    })),
    leaderboard,
  }
}
