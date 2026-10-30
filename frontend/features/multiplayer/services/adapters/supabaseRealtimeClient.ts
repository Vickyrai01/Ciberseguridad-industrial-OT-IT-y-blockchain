import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js'
import { readSupabasePublicConfig } from '../supabaseConfig'

export function createSupabaseRealtimeClient() {
  const config = readSupabasePublicConfig()
  const client: SupabaseClient | null = config ? createClient(config.url, config.publishableKey) : null

  return {
    subscribeToRoom: (roomId: string, onRoomUpdated: () => void): (() => void) => {
      if (!client) return () => undefined
      const channel: RealtimeChannel = client.channel(`room:${roomId}`, {
        config: { broadcast: { ack: false }, presence: { key: roomId } },
      })
      void channel.on('broadcast', { event: 'room.updated' }, onRoomUpdated).subscribe()
      return () => {
        void client.removeChannel(channel)
      }
    },
  }
}
