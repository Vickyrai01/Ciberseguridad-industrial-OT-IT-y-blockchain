create extension if not exists pgcrypto;

create type public.game_room_status as enum ('WAITING', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');
create type public.game_participant_status as enum ('WAITING', 'PLAYING', 'FINISHED', 'DISCONNECTED');
create type public.game_question_progress_status as enum ('OPEN', 'ANSWERED');
create type public.game_choice_id as enum ('a', 'b', 'c');

create table public.game_rooms (
  id uuid primary key default gen_random_uuid(), code text not null unique,
  status public.game_room_status not null default 'WAITING', created_at timestamptz not null default now(),
  started_at timestamptz, finished_at timestamptz, presenter_token_hash text not null,
  settings jsonb not null default '{"basePoints":800,"speedBonus":200,"speedWindowSeconds":30}'::jsonb,
  quiz_version text not null default '2026-10-01', max_players integer not null default 100 check (max_players between 1 and 500),
  scenario_order integer[] not null check (cardinality(scenario_order) = 5)
);
create table public.game_participants (
  id uuid primary key default gen_random_uuid(), room_id uuid not null references public.game_rooms(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 20), normalized_nickname text not null,
  participant_token_hash text not null unique, status public.game_participant_status not null default 'WAITING',
  joined_at timestamptz not null default now(), finished_at timestamptz, last_seen_at timestamptz not null default now(),
  total_score integer not null default 0 check (total_score >= 0), total_response_time_ms bigint not null default 0 check (total_response_time_ms >= 0),
  unique (room_id, normalized_nickname)
);
create table public.game_question_progress (
  participant_id uuid not null references public.game_participants(id) on delete cascade, scenario_id integer not null,
  question_index integer not null check (question_index between 0 and 4), status public.game_question_progress_status not null default 'OPEN',
  opened_at timestamptz not null default now(), submitted_at timestamptz, primary key (participant_id, scenario_id)
);
create table public.game_answers (
  id uuid primary key default gen_random_uuid(), room_id uuid not null references public.game_rooms(id) on delete cascade,
  participant_id uuid not null references public.game_participants(id) on delete cascade, scenario_id integer not null,
  selected_option public.game_choice_id not null, is_correct boolean not null,
  elapsed_ms integer not null check (elapsed_ms >= 0), awarded_points integer not null check (awarded_points >= 0 and awarded_points <= 1000), answered_at timestamptz not null default now(),
  unique (participant_id, scenario_id)
);
create index game_participants_room_score_idx on public.game_participants(room_id, total_score desc, total_response_time_ms asc, nickname asc);
create index game_answers_room_idx on public.game_answers(room_id, answered_at);

alter table public.game_rooms enable row level security;
alter table public.game_participants enable row level security;
alter table public.game_question_progress enable row level security;
alter table public.game_answers enable row level security;
revoke all on all tables in schema public from anon, authenticated;

create or replace function public.submit_answer_atomic(p_token_hash text, p_scenario_id integer, p_choice public.game_choice_id)
returns jsonb language plpgsql security definer set search_path = public as $$
declare p game_participants%rowtype; r game_rooms%rowtype; q game_question_progress%rowtype; correct boolean; elapsed integer; points integer; completed integer; next_id integer;
  base_points integer; speed_bonus integer; speed_window_ms integer; total_questions integer;
begin
  select * into p from game_participants where participant_token_hash = p_token_hash for update;
  if not found then raise exception using errcode = '28000', message = 'PARTICIPANT_NOT_AUTHORIZED'; end if;
  select * into r from game_rooms where id = p.room_id for update;
  base_points := (r.settings->>'basePoints')::integer; speed_bonus := (r.settings->>'speedBonus')::integer; speed_window_ms := (r.settings->>'speedWindowSeconds')::integer * 1000; total_questions := cardinality(r.scenario_order);
  if r.status <> 'IN_PROGRESS'::game_room_status then raise exception using errcode = 'P0001', message = 'ROOM_NOT_ACTIVE'; end if;
  if not (p_scenario_id = any(r.scenario_order)) then raise exception using errcode = 'P0001', message = 'INVALID_SCENARIO'; end if;
  if exists (select 1 from game_answers where participant_id = p.id and scenario_id = p_scenario_id) then raise exception using errcode = 'P0001', message = 'ANSWER_ALREADY_SUBMITTED'; end if;
  select * into q from game_question_progress where participant_id = p.id and scenario_id = p_scenario_id for update;
  if not found or q.status <> 'OPEN'::game_question_progress_status then raise exception using errcode = 'P0001', message = 'QUESTION_NOT_OPEN'; end if;
  correct := (p_scenario_id, p_choice) in ((1,'b'),(2,'b'),(3,'b'),(4,'b'),(5,'c'));
  elapsed := greatest(0, extract(epoch from (clock_timestamp() - q.opened_at))::integer * 1000);
  points := case when correct then base_points + round(speed_bonus * greatest(0, 1 - least(elapsed, speed_window_ms)::numeric / speed_window_ms))::integer else 0 end;
  insert into game_answers(room_id, participant_id, scenario_id, selected_option, is_correct, elapsed_ms, awarded_points) values (p.room_id,p.id,p_scenario_id,p_choice,correct,elapsed,points);
  update game_question_progress set status='ANSWERED'::game_question_progress_status, submitted_at=clock_timestamp() where participant_id=p.id and scenario_id=p_scenario_id;
  update game_participants set total_score=total_score+points, total_response_time_ms=total_response_time_ms+elapsed, last_seen_at=clock_timestamp(), status=case when (select count(*) from game_answers where participant_id=p.id)=total_questions then 'FINISHED'::game_participant_status else 'PLAYING'::game_participant_status end, finished_at=case when (select count(*) from game_answers where participant_id=p.id)=total_questions then clock_timestamp() else finished_at end where id=p.id returning * into p;
  completed := (select count(*) from game_answers where participant_id=p.id); next_id := case when completed < total_questions then r.scenario_order[completed+1] else null end;
  return jsonb_build_object('accepted',true,'isCorrect',correct,'awardedPoints',points,'score',p.total_score,'completedQuestions',completed,'nextScenarioId',next_id);
end; $$;
revoke all on function public.submit_answer_atomic(text, integer, public.game_choice_id) from public, anon, authenticated;

create or replace function public.cleanup_expired_rooms() returns integer language sql security definer set search_path = public as $$
  update game_rooms set status='CANCELLED' where status in ('WAITING','IN_PROGRESS') and created_at < now() - interval '24 hours'; select count(*)::integer from game_rooms where status='CANCELLED' and finished_at is null;
$$;
