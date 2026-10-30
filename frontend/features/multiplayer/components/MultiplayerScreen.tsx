import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { Check, Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { pageMotion, pageTransition } from '../../../animations/motionTokens'
import type { ParticipantSession, RoomSnapshot } from '../types'
import { MULTIPLAYER_CONFIG, MULTIPLAYER_MODE, ROOM_STATUS, type MultiplayerViewMode } from '../constants'
import { MultiplayerLeaderboard } from './MultiplayerLeaderboard'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'

interface MultiplayerScreenProps {
  mode: MultiplayerViewMode
  configured: boolean
  session: ParticipantSession | null
  room: RoomSnapshot | null
  error: string | null
  loading: boolean
  onJoin: (code: string, nickname: string) => void
  onCreate: () => void
  onStart: () => void
  onFinish: () => void
  onBack: () => void
}

export function MultiplayerScreen(props: MultiplayerScreenProps) {
  const { t } = useTranslation()
  const [code, setCode] = useState(() => new URLSearchParams(window.location.search).get('room')?.toUpperCase() ?? '')
  const [nickname, setNickname] = useState('')
  const [qr, setQr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const inviteUrl = props.room ? `${window.location.origin}${window.location.pathname}?room=${props.room.code}` : ''
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
  if (!props.configured)
    return (
      <Panel>
        <h1>{t('multiplayer.unavailable')}</h1>
        <p>{t('multiplayer.configureHint')}</p>
        <button type="button" className="text-btn" onClick={props.onBack}>
          {t('common.back')}
        </button>
      </Panel>
    )
  if (props.mode === MULTIPLAYER_MODE.ENTRY)
    return (
      <Panel variant="entry">
        <div className="multiplayer-entry-heading">
          <span className="eyebrow">{t('common.liveSimulation')}</span>
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
          <PrimaryButton
            disabled={
              props.loading ||
              code.trim().length < MULTIPLAYER_CONFIG.roomCodeMinLength ||
              nickname.trim().length < MULTIPLAYER_CONFIG.minNicknameLength
            }
            onClick={() => props.onJoin(code, nickname)}>
            {t('multiplayer.join')}
          </PrimaryButton>
          <button type="button" className="secondary-btn multiplayer-create-btn" onClick={props.onCreate}>
            {t('multiplayer.create')}
          </button>
          <button type="button" className="text-btn" onClick={props.onBack}>
            {t('common.back')}
          </button>
        </div>
        {props.error && (
          <p className="multiplayer-error">
            {t(`multiplayer.errors.${props.error}` as never, { defaultValue: props.error })}
          </p>
        )}
      </Panel>
    )
  return (
    <Panel>
      <div className="multiplayer-heading">
        <div>
          <span className="eyebrow">
            {props.mode === MULTIPLAYER_MODE.FINISHED ? t('multiplayer.finished') : t('multiplayer.waitingRoom')}
          </span>
          <h1>{props.room?.code}</h1>
        </div>
        {qr && <img className="multiplayer-qr" src={qr} alt={t('multiplayer.qrAlt')} />}
      </div>
      <div className="multiplayer-invite" aria-label={t('multiplayer.invite')}>
        <div className="multiplayer-invite-heading">
          <span className="eyebrow">{t('multiplayer.accessChannel')}</span>
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
        {copied && <span className="multiplayer-copied" role="status">{t('multiplayer.copiedInvite')}</span>}
      </div>
      <div className="multiplayer-roster">
        <div className="roster-title">
          {t('multiplayer.participants')} · {props.room?.participants.length ?? 0}
        </div>
        {props.room?.participants.map((participant) => (
          <div className="roster-row" key={participant.id}>
            <span className={participant.connected ? 'status-dot online' : 'status-dot'} />
            {participant.nickname}
            <span>{t(`multiplayer.status.${participant.status}` as never, { defaultValue: participant.status })}</span>
          </div>
        ))}
      </div>
      <MultiplayerLeaderboard
        entries={props.room?.leaderboard ?? []}
        currentParticipantId={props.session?.participantId}
      />
      <div className="multiplayer-actions">
        {props.session?.presenterToken && props.mode === MULTIPLAYER_MODE.LOBBY && (
          <PrimaryButton disabled={props.loading || (props.room?.participants.length ?? 0) < 1} onClick={props.onStart}>
            {t('multiplayer.start')}
          </PrimaryButton>
        )}
        {props.session && !props.session.presenterToken && props.mode === MULTIPLAYER_MODE.LOBBY && (
          <PrimaryButton
            disabled={props.loading || props.room?.status !== ROOM_STATUS.IN_PROGRESS}
            onClick={props.onStart}>
            {t('multiplayer.enterGame')}
          </PrimaryButton>
        )}
        {props.session?.presenterToken && props.mode === MULTIPLAYER_MODE.FINISHED && (
          <p>{t('multiplayer.podiumReady')}</p>
        )}
        <button type="button" className="text-btn" onClick={props.onBack}>
          {t('common.back')}
        </button>
      </div>
      {props.error && <p className="multiplayer-error">{props.error}</p>}
    </Panel>
  )
}

function Panel({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'entry' }) {
  return (
    <motion.main
      className={`multiplayer-page multiplayer-page-${variant} ot-layout-screen`}
      {...pageMotion}
      transition={pageTransition}>
      <section className={`multiplayer-panel multiplayer-panel-${variant}`}>{children}</section>
    </motion.main>
  )
}
