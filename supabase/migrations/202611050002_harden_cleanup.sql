create or replace function public.cleanup_expired_rooms() returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  expired_count integer;
begin
  update game_rooms
  set status = 'CANCELLED', finished_at = now()
  where status in ('WAITING', 'IN_PROGRESS')
    and created_at < now() - interval '24 hours';

  get diagnostics expired_count = row_count;
  return expired_count;
end;
$$;

revoke all on function public.cleanup_expired_rooms() from public, anon, authenticated;
