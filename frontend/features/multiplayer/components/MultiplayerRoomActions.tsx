import { useTranslation } from 'react-i18next'
import type { ParticipantSession, RoomSnapshot } from '../types'
import {
  MULTIPLAYER_CONNECTION_STATUS,
  MULTIPLAYER_MODE,
  ROOM_STATUS,
  type MultiplayerConnectionStatus,
  type MultiplayerViewMode,
} from '../constants'
import { Button } from '../../../shared/components/ui/Button'

interface MultiplayerRoomActionsProps {
  connectionStatus: MultiplayerConnectionStatus
  loading: boolean
  mode: MultiplayerViewMode
  onBack: () => void
  onStart: () => void
  room: RoomSnapshot | null
  session: ParticipantSession | null
}

export function MultiplayerRoomActions({
  connectionStatus,
  loading,
  mode,
  onBack,
  onStart,
  room,
  session,
}: MultiplayerRoomActionsProps) {
  const { t } = useTranslation()

  return (
    <>
      {session && (
        <p className="multiplayer-room-status" role="status" aria-live="polite">
          {connectionStatus === MULTIPLAYER_CONNECTION_STATUS.CONNECTED
            ? t('multiplayer.connection.connected')
            : connectionStatus === MULTIPLAYER_CONNECTION_STATUS.CONNECTING
              ? t('multiplayer.connection.connecting')
              : t('multiplayer.connection.disconnected')}
        </p>
      )}
      <div className="multiplayer-actions">
        {session?.presenterToken && mode === MULTIPLAYER_MODE.LOBBY && (
          <Button
            disabled={(room?.participants.length ?? 0) < 1}
            loading={loading}
            loadingLabel={t('multiplayer.starting')}
            onClick={onStart}>
            {t('multiplayer.start')}
          </Button>
        )}
        {session && !session.presenterToken && mode === MULTIPLAYER_MODE.LOBBY && (
          <p className="multiplayer-room-status" role="status">
            {room?.status === ROOM_STATUS.IN_PROGRESS
              ? t('multiplayer.connecting')
              : t('multiplayer.waitingForPresenterStart')}
          </p>
        )}
        {session?.presenterToken && mode === MULTIPLAYER_MODE.FINISHED && <p>{t('multiplayer.podiumReady')}</p>}
        <Button variant="text" onClick={onBack}>
          {t('common.back')}
        </Button>
      </div>
    </>
  )
}
