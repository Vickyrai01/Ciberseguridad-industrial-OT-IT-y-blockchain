import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { useTranslation } from 'react-i18next'
import { pageMotion, pageTransition } from '../../../animations/motionTokens'
import type { ParticipantSession, RoomSnapshot } from '../types'
import { MULTIPLAYER_CONFIG, MULTIPLAYER_MODE, ROOM_STATUS, type MultiplayerViewMode } from '../constants'

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
  const inviteUrl = props.room ? `${window.location.origin}${window.location.pathname}?room=${props.room.code}` : ''
  useEffect(() => {
    if (inviteUrl) void QRCode.toDataURL(inviteUrl, { margin: 1, width: 220 }).then(setQr)
  }, [inviteUrl])
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
      <Panel>
        <h1>{t('multiplayer.title')}</h1>
        <p className="muted">{t('multiplayer.subtitle')}</p>
        <div className="multiplayer-form">
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
          <button
            type="button"
            className="primary-btn"
            disabled={
              props.loading ||
              code.trim().length < MULTIPLAYER_CONFIG.roomCodeMinLength ||
              nickname.trim().length < MULTIPLAYER_CONFIG.minNicknameLength
            }
            onClick={() => props.onJoin(code, nickname)}>
            {t('multiplayer.join')}
          </button>
          <button type="button" className="text-btn" onClick={props.onCreate}>
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
      <p>
        {t('multiplayer.invite')}: <strong>{inviteUrl}</strong>
      </p>
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
      <div className="multiplayer-actions">
        {props.session?.presenterToken && props.mode === MULTIPLAYER_MODE.LOBBY && (
          <button
            type="button"
            className="primary-btn"
            disabled={props.loading || (props.room?.participants.length ?? 0) < 1}
            onClick={props.onStart}>
            {t('multiplayer.start')}
          </button>
        )}
        {props.session && !props.session.presenterToken && props.mode === MULTIPLAYER_MODE.LOBBY && (
          <button
            type="button"
            className="primary-btn"
            disabled={props.loading || props.room?.status !== ROOM_STATUS.IN_PROGRESS}
            onClick={props.onStart}>
            {t('multiplayer.enterGame')}
          </button>
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

function Panel({ children }: { children: ReactNode }) {
  return (
    <motion.main className="multiplayer-page ot-layout-screen" {...pageMotion} transition={pageTransition}>
      <section className="multiplayer-panel">{children}</section>
    </motion.main>
  )
}
