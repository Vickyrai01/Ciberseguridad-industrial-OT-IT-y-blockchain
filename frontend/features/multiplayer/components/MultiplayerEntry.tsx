import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MULTIPLAYER_CONFIG } from '../constants'
import { Button } from '../../../shared/components/ui/Button'
import { MultiplayerError } from './MultiplayerError'
import { MultiplayerPanel } from './MultiplayerPanel'
import { Eyebrow } from '../../../shared/components/ui/Eyebrow'

interface MultiplayerEntryProps {
  error: string | null
  loading: boolean
  onBack: () => void
  onJoin: (code: string, nickname: string) => void
}

export function MultiplayerEntry({ error, loading, onBack, onJoin }: MultiplayerEntryProps) {
  const { t } = useTranslation()
  const [code, setCode] = useState(() => new URLSearchParams(window.location.search).get('room')?.toUpperCase() ?? '')
  const [nickname, setNickname] = useState('')

  return (
    <MultiplayerPanel variant="entry">
      <div className="multiplayer-entry-heading">
        <Eyebrow>{t('common.liveSimulation')}</Eyebrow>
        <h1>{t('multiplayer.title')}</h1>
        <p className="muted">{t('multiplayer.subtitle')}</p>
      </div>
      <div className="multiplayer-form multiplayer-entry-form">
        <label>
          {t('multiplayer.roomCode')}
          <input
            value={code}
            maxLength={MULTIPLAYER_CONFIG.roomCodeMaxLength}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="OT-7K42"
          />
        </label>
        <label>
          {t('multiplayer.nickname')}
          <input
            value={nickname}
            maxLength={MULTIPLAYER_CONFIG.maxNicknameLength}
            onChange={(event) => setNickname(event.target.value)}
            placeholder={t('multiplayer.nicknamePlaceholder')}
          />
        </label>
        <Button
          disabled={
            code.trim().length < MULTIPLAYER_CONFIG.roomCodeMinLength ||
            nickname.trim().length < MULTIPLAYER_CONFIG.minNicknameLength
          }
          loading={loading}
          loadingLabel={t('multiplayer.connecting')}
          onClick={() => onJoin(code, nickname)}>
          {t('multiplayer.join')}
        </Button>
        <Button variant="text" disabled={loading} onClick={onBack}>
          {t('common.back')}
        </Button>
      </div>
      <MultiplayerError error={error} />
    </MultiplayerPanel>
  )
}
