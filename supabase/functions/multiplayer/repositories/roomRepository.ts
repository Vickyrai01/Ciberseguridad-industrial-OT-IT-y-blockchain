import { supabase } from '../infrastructure/supabase.ts'
import { AppError } from '../shared/errors.ts'
import type { RoomStatus } from '../domain/rooms.ts'
import { HTTP_STATUS, QUESTION_STATUS } from '../shared/constants.ts'

export async function insertRoom(input: { code: string; presenterTokenHash: string; scenarioOrder: number[] }) {
  const { data, error } = await supabase
    .from('game_rooms')
    .insert({ code: input.code, presenter_token_hash: input.presenterTokenHash, scenario_order: input.scenarioOrder })
    .select('id')
    .single()
  if (error) throw error
  return data as { id: string }
}

export async function findRoomById(roomId: string, full = false) {
  const query = full
    ? supabase.from('game_rooms').select('*').eq('id', roomId).single()
    : supabase
        .from('game_rooms')
        .select('id,code,status,quiz_version,max_players,scenario_order')
        .eq('id', roomId)
        .single()
  const { data, error } = await query
  if (error || !data) throw new AppError('ROOM_NOT_FOUND', 404)
  return data
}

export async function findRoomByCode(code: string) {
  const { data, error } = await supabase.from('game_rooms').select('*').eq('code', code).single()
  if (error || !data) throw new AppError('ROOM_NOT_FOUND', 404)
  return data
}

export async function updateRoomStatus(
  roomId: string,
  status: RoomStatus,
  startedAt: string | null,
  finishedAt: string | null,
) {
  const { error } = await supabase
    .from('game_rooms')
    .update({ status, started_at: startedAt, finished_at: finishedAt })
    .eq('id', roomId)
  if (error) throw error
}

export async function countParticipants(roomId: string): Promise<number> {
  const { count, error } = await supabase
    .from('game_participants')
    .select('id', { count: 'exact', head: true })
    .eq('room_id', roomId)
  if (error) throw error
  return count ?? 0
}

export async function insertParticipant(input: {
  roomId: string
  nickname: string
  normalized: string
  tokenHash: string
}) {
  const { data, error } = await supabase
    .from('game_participants')
    .insert({
      room_id: input.roomId,
      nickname: input.nickname,
      normalized_nickname: input.normalized,
      participant_token_hash: input.tokenHash,
    })
    .select('id')
    .single()
  if (error) {
    if (error.code === '23505') throw new AppError('NICKNAME_TAKEN')
    throw error
  }
  return data as { id: string }
}

export async function findParticipantByTokenHash(tokenHash: string | undefined) {
  if (!tokenHash) throw new AppError('PARTICIPANT_NOT_AUTHORIZED', HTTP_STATUS.UNAUTHORIZED)
  const { data, error } = await supabase
    .from('game_participants')
    .select('id,room_id')
    .eq('participant_token_hash', tokenHash)
    .single()
  if (error || !data) throw new AppError('PARTICIPANT_NOT_AUTHORIZED', HTTP_STATUS.UNAUTHORIZED)
  return data as { id: string; room_id: string }
}

export async function listParticipants(roomId: string) {
  const { data, error } = await supabase
    .from('game_participants')
    .select('id,nickname,status,last_seen_at,total_score,total_response_time_ms')
    .eq('room_id', roomId)
    .order('nickname')
  if (error) throw error
  return data ?? []
}

export async function listAnswerCounts(roomId: string) {
  const { data, error } = await supabase.from('game_answers').select('participant_id').eq('room_id', roomId)
  if (error) throw error
  const counts = new Map<string, number>()
  for (const answer of data ?? []) counts.set(answer.participant_id, (counts.get(answer.participant_id) ?? 0) + 1)
  return counts
}

export async function countAnsweredQuestions(participantId: string): Promise<number> {
  const { count, error } = await supabase
    .from('game_question_progress')
    .select('scenario_id', { count: 'exact', head: true })
    .eq('participant_id', participantId)
    .eq('status', QUESTION_STATUS.ANSWERED)
  if (error) throw error
  return count ?? 0
}

export async function openQuestion(input: { participantId: string; scenarioId: number; questionIndex: number }) {
  const { error } = await supabase.from('game_question_progress').upsert(
    {
      participant_id: input.participantId,
      scenario_id: input.scenarioId,
      question_index: input.questionIndex,
      status: QUESTION_STATUS.OPEN,
      opened_at: new Date().toISOString(),
    },
    { onConflict: 'participant_id,scenario_id', ignoreDuplicates: true },
  )
  if (error) throw error
}

export async function submitAnswer(input: { tokenHash: string; scenarioId: number; choiceId: string }) {
  const { data, error } = await supabase.rpc('submit_answer_atomic', {
    p_token_hash: input.tokenHash,
    p_scenario_id: input.scenarioId,
    p_choice: input.choiceId,
  })
  if (error) {
    if (error.code === '28000') throw new AppError(error.message, HTTP_STATUS.UNAUTHORIZED)
    throw new AppError(error.message, 409)
  }
  return data
}
