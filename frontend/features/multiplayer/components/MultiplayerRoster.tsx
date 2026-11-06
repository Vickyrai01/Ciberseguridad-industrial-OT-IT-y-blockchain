import { useTranslation } from 'react-i18next'
import type { RoomSnapshot } from '../types'

interface MultiplayerRosterProps {
  participants: RoomSnapshot['participants']
}

export function MultiplayerRoster({ participants }: MultiplayerRosterProps) {
  const { t } = useTranslation()

  return (
    <div className="multiplayer-roster">
      <div className="roster-title">
        {t('multiplayer.participants')} · {participants.length}
      </div>
      {participants.map((participant) => (
        <div className="roster-row" key={participant.id}>
          <span className={participant.connected ? 'status-dot online' : 'status-dot'} aria-hidden="true" />
          <span>{participant.nickname}</span>
          <span>{t(`multiplayer.status.${participant.status}` as never, { defaultValue: participant.status })}</span>
        </div>
      ))}
    </div>
  )
}
