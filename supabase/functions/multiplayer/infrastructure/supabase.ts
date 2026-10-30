import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

export async function broadcastRoomUpdated(roomId: string): Promise<void> {
  await supabase.channel(`room:${roomId}`).send({ type: 'broadcast', event: 'room.updated', payload: { roomId } })
}
