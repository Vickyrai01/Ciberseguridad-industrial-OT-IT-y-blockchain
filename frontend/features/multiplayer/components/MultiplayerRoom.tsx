import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import QRCode from 'qrcode'
import { useTranslation } from 'react-i18next'
import type { ParticipantSession, RoomSnapshot } from '../types'
import { MULTIPLAYER_MODE, ROOM_STATUS, type MultiplayerViewMode } from '../constants'
import { Button } from '../../../shared/components/ui/Button'
import { MultiplayerError } from './MultiplayerError'
import { MultiplayerLeaderboard } from './MultiplayerLeaderboard'
import { MultiplayerPanel } from './MultiplayerPanel'
import { Eyebrow } from '../../../shared/components/ui/Eyebrow'

interface MultiplayerRoomProps {
  error: string | null
  loading: boolean
  mode: MultiplayerViewMode
  onBack: () => void
  onStart: () => void
  room: RoomSnapshot | null
  session: ParticipantSession | null
}

export function MultiplayerRoom({ error, loading, mode, onBack, onStart, room, session }: MultiplayerRoomProps) {
  const { t } = useTranslation()
  const [qr, setQr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const inviteUrl = room ? `${window.location.origin}${window.location.pathname}?room=${room.code}` : ''

  useEffect(() => {
    if (inviteUrl) void QRCode.toDataURL(inviteUrl, { margin: 1, width: 220 }).then(setQr)
  }, [inviteUrl])

  const copyInviteUrl = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <MultiplayerPanel>
      <div className="multiplayer-heading">
        <div>
          <Eyebrow>
            {mode === MULTIPLAYER_MODE.FINISHED ? t('multiplayer.finished') : t('multiplayer.waitingRoom')}
          </Eyebrow>
          <h1>{room?.code}</h1>
        </div>
        {qr && <img className="multiplayer-qr" src={qr} alt={t('multiplayer.qrAlt')} />}
      </div>
      <div className="multiplayer-invite" aria-label={t('multiplayer.invite')}>
        <div className="multiplayer-invite-heading">
          <Eyebrow>{t('multiplayer.accessChannel')}</Eyebrow>
          <span className="multiplayer-invite-hint">{t('multiplayer.inviteHint')}</span>
        </div>
        <div className="multiplayer-invite-url">
          <code>{inviteUrl}</code>
          <button
            type="button"
            className="multiplayer-copy-btn"
            onClick={() => void copyInviteUrl()}
            aria-label={t('multiplayer.copyInvite')}
            title={t('multiplayer.copyInvite')}
            disabled={!inviteUrl}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          </button>
        </div>
        {copied && (
          <span className="multiplayer-copied" role="status">
            {t('multiplayer.copiedInvite')}
          </span>
        )}
      </div>
      <div className="multiplayer-roster">
        <div className="roster-title">
          {t('multiplayer.participants')} · {room?.participants.length ?? 0}
        </div>
        {room?.participants.map((participant) => (
          <div className="roster-row" key={participant.id}>
            <span className={participant.connected ? 'status-dot online' : 'status-dot'} />
            {participant.nickname}
            <span>{t(`multiplayer.status.${participant.status}` as never, { defaultValue: participant.status })}</span>
          </div>
        ))}
      </div>
      <MultiplayerLeaderboard entries={room?.leaderboard ?? []} currentParticipantId={session?.participantId} />
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
      <MultiplayerError error={error} />
    </MultiplayerPanel>
  )
}
