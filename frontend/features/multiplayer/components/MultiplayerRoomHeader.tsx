import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useTranslation } from 'react-i18next'
import type { RoomSnapshot } from '../types'
import { MULTIPLAYER_MODE, type MultiplayerViewMode } from '../constants'
import { Eyebrow } from '../../../shared/components/ui/Eyebrow'

interface MultiplayerRoomHeaderProps {
  mode: MultiplayerViewMode
  room: RoomSnapshot | null
}

export function MultiplayerRoomHeader({ mode, room }: MultiplayerRoomHeaderProps) {
  const { t } = useTranslation()
  const [qr, setQr] = useState<string | null>(null)
  const inviteUrl = room ? `${window.location.origin}${window.location.pathname}?room=${room.code}` : ''

  useEffect(() => {
    let active = true
    setQr(null)
    if (inviteUrl) {
      void QRCode.toDataURL(inviteUrl, { margin: 1, width: 220 }).then((value) => {
        if (active) setQr(value)
      })
    }
    return () => {
      active = false
    }
  }, [inviteUrl])

  return (
    <div className="multiplayer-heading">
      <div>
        <Eyebrow>
          {mode === MULTIPLAYER_MODE.FINISHED ? t('multiplayer.finished') : t('multiplayer.waitingRoom')}
        </Eyebrow>
        <h1>{room?.code}</h1>
      </div>
      {qr && <img className="multiplayer-qr" src={qr} alt={t('multiplayer.qrAlt')} />}
    </div>
  )
}
