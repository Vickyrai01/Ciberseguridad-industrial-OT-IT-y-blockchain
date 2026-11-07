import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js'
import { readSupabasePublicConfig } from '../supabaseConfig'

export const REALTIME_CONNECTION_STATUS = {
  SUBSCRIBED: 'SUBSCRIBED',
  CHANNEL_ERROR: 'CHANNEL_ERROR',
  TIMED_OUT: 'TIMED_OUT',
  CLOSED: 'CLOSED',
} as const
export type RealtimeConnectionStatus = (typeof REALTIME_CONNECTION_STATUS)[keyof typeof REALTIME_CONNECTION_STATUS]

export function createSupabaseRealtimeClient() {
  const config = readSupabasePublicConfig()
  const client: SupabaseClient | null = config ? createClient(config.url, config.publishableKey) : null

  return {
    subscribeToRoom: (
      roomId: string,
      onRoomUpdated: () => void,
      onStatusChanged?: (status: RealtimeConnectionStatus) => void,
    ): (() => void) => {
      if (!client) return () => undefined
      const channel: RealtimeChannel = client.channel(`room:${roomId}`, {
        config: { broadcast: { ack: false }, presence: { key: roomId } },
      })
      void channel.on('broadcast', { event: 'room.updated' }, onRoomUpdated).subscribe((status) => {
        if (
          status === REALTIME_CONNECTION_STATUS.SUBSCRIBED ||
          status === REALTIME_CONNECTION_STATUS.CHANNEL_ERROR ||
          status === REALTIME_CONNECTION_STATUS.TIMED_OUT ||
          status === REALTIME_CONNECTION_STATUS.CLOSED
        )
          onStatusChanged?.(status)
      })
      return () => {
        void client.removeChannel(channel)
      }
    },
  }
}
