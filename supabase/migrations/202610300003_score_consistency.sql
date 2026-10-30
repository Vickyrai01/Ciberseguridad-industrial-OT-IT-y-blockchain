create or replace function public.submit_answer_atomic(p_token_hash text, p_scenario_id integer, p_choice public.game_choice_id)
returns jsonb language plpgsql security definer set search_path = public as $$
declare p game_participants%rowtype; r game_rooms%rowtype; q game_question_progress%rowtype; correct boolean; elapsed integer; points integer; completed integer; next_id integer;
  base_points integer; speed_bonus integer; speed_window_ms integer; total_questions integer;
begin
  select * into p from game_participants where participant_token_hash = p_token_hash for update;
  if not found then raise exception using errcode = '28000', message = 'PARTICIPANT_NOT_AUTHORIZED'; end if;
  select * into r from game_rooms where id = p.room_id for update;
  base_points := coalesce((r.settings->>'basePoints')::integer, 800);
  speed_bonus := coalesce((r.settings->>'speedBonus')::integer, 200);
  speed_window_ms := coalesce((r.settings->>'speedWindowSeconds')::integer, 30) * 1000;
  total_questions := cardinality(r.scenario_order);
  if r.status <> 'IN_PROGRESS'::game_room_status then raise exception using errcode = 'P0001', message = 'ROOM_NOT_ACTIVE'; end if;
  if p_scenario_id <> r.scenario_order[r.current_question_index + 1] then raise exception using errcode = 'P0001', message = 'INVALID_SCENARIO'; end if;
  if exists (select 1 from game_answers where participant_id = p.id and scenario_id = p_scenario_id) then raise exception using errcode = 'P0001', message = 'ANSWER_ALREADY_SUBMITTED'; end if;
  select * into q from game_question_progress where participant_id = p.id and scenario_id = p_scenario_id for update;
  if not found or q.status <> 'OPEN'::game_question_progress_status then raise exception using errcode = 'P0001', message = 'QUESTION_NOT_OPEN'; end if;
  correct := (p_scenario_id = 1 and p_choice = 'b'::game_choice_id)
    or (p_scenario_id = 2 and p_choice = 'b'::game_choice_id)
    or (p_scenario_id = 3 and p_choice = 'b'::game_choice_id)
    or (p_scenario_id = 4 and p_choice = 'b'::game_choice_id)
    or (p_scenario_id = 5 and p_choice = 'c'::game_choice_id);
  elapsed := greatest(0, extract(epoch from (clock_timestamp() - q.opened_at))::integer * 1000);
  points := case when correct then base_points + round(speed_bonus * greatest(0, 1 - least(elapsed, speed_window_ms)::numeric / speed_window_ms))::integer else 0 end;
  insert into game_answers(room_id, participant_id, scenario_id, selected_option, is_correct, elapsed_ms, awarded_points) values (p.room_id,p.id,p_scenario_id,p_choice,correct,elapsed,points);
  update game_question_progress set status='ANSWERED'::game_question_progress_status, submitted_at=clock_timestamp() where participant_id=p.id and scenario_id=p_scenario_id;
  update game_participants set total_score=coalesce(total_score, 0)+points, total_response_time_ms=coalesce(total_response_time_ms, 0)+elapsed, last_seen_at=clock_timestamp(), status=case when (select count(*) from game_answers where participant_id=p.id)=total_questions then 'FINISHED'::game_participant_status else 'PLAYING'::game_participant_status end, finished_at=case when (select count(*) from game_answers where participant_id=p.id)=total_questions then clock_timestamp() else finished_at end where id=p.id returning * into p;
  completed := (select count(*) from game_answers where participant_id=p.id); next_id := case when completed < total_questions then r.scenario_order[completed+1] else null end;
  return jsonb_build_object('accepted',true,'isCorrect',correct,'awardedPoints',points,'score',p.total_score,'completedQuestions',completed,'nextScenarioId',next_id);
end; $$;

revoke all on function public.submit_answer_atomic(text, integer, public.game_choice_id) from public, anon, authenticated;
