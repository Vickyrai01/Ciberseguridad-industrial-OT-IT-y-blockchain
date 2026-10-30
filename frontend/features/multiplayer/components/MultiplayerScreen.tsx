import { useTranslation } from 'react-i18next'
import type { ParticipantSession, RoomSnapshot } from '../types'
import { MULTIPLAYER_MODE, type MultiplayerViewMode } from '../constants'
import { MultiplayerEntry } from './MultiplayerEntry'
import { MultiplayerPanel } from './MultiplayerPanel'
import { MultiplayerRoom } from './MultiplayerRoom'

export interface MultiplayerScreenProps {
  mode: MultiplayerViewMode
  configured: boolean
  session: ParticipantSession | null
  room: RoomSnapshot | null
  error: string | null
  loading: boolean
  onJoin: (code: string, nickname: string) => void
  onStart: () => void
  onBack: () => void
}

export function MultiplayerScreen(props: MultiplayerScreenProps) {
  const { t } = useTranslation()

  if (!props.configured)
    return (
      <MultiplayerPanel>
        <h1>{t('multiplayer.unavailable')}</h1>
        <p>{t('multiplayer.configureHint')}</p>
        <button type="button" className="text-btn" onClick={props.onBack}>
          {t('common.back')}
        </button>
      </MultiplayerPanel>
    )

  if (props.mode === MULTIPLAYER_MODE.ENTRY)
    return <MultiplayerEntry error={props.error} loading={props.loading} onBack={props.onBack} onJoin={props.onJoin} />

  return (
    <MultiplayerRoom
      error={props.error}
      loading={props.loading}
      mode={props.mode}
      onBack={props.onBack}
      onStart={props.onStart}
      room={props.room}
      session={props.session}
    />
  )
}
