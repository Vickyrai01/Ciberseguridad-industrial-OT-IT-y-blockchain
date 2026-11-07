import { createClient } from '@supabase/supabase-js'

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export const supabase = createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'))

export async function broadcastRoomUpdated(roomId: string): Promise<void> {
  const channel = supabase.channel(`room:${roomId}`)
  try {
    await channel.send({ type: 'broadcast', event: 'room.updated', payload: { roomId } })
  } finally {
    await supabase.removeChannel(channel)
  }
}
