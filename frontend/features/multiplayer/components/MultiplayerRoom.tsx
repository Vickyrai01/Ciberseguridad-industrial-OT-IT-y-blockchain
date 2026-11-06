import type { ParticipantSession, RoomSnapshot } from '../types'
import type { MultiplayerConnectionStatus, MultiplayerViewMode } from '../constants'
import { MultiplayerError } from './MultiplayerError'
import { MultiplayerInvite } from './MultiplayerInvite'
import { MultiplayerLeaderboard } from './MultiplayerLeaderboard'
import { MultiplayerPanel } from './MultiplayerPanel'
import { MultiplayerRoomActions } from './MultiplayerRoomActions'
import { MultiplayerRoomHeader } from './MultiplayerRoomHeader'
import { MultiplayerRoster } from './MultiplayerRoster'

interface MultiplayerRoomProps {
  error: string | null
  loading: boolean
  mode: MultiplayerViewMode
  onBack: () => void
  onStart: () => void
  room: RoomSnapshot | null
  session: ParticipantSession | null
  connectionStatus: MultiplayerConnectionStatus
}

export function MultiplayerRoom({
  error,
  loading,
  mode,
  onBack,
  onStart,
  room,
  session,
  connectionStatus,
}: MultiplayerRoomProps) {
  const inviteUrl = room ? `${window.location.origin}${window.location.pathname}?room=${room.code}` : ''

  return (
    <MultiplayerPanel>
      <MultiplayerRoomHeader mode={mode} room={room} />
      <MultiplayerInvite inviteUrl={inviteUrl} />
      <MultiplayerRoster participants={room?.participants ?? []} />
      <MultiplayerLeaderboard entries={room?.leaderboard ?? []} currentParticipantId={session?.participantId} />
      <MultiplayerRoomActions
        connectionStatus={connectionStatus}
        loading={loading}
        mode={mode}
        onBack={onBack}
        onStart={onStart}
        room={room}
        session={session}
      />
      <MultiplayerError error={error} />
    </MultiplayerPanel>
  )
}
