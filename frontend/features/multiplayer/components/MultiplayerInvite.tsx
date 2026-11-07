import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MULTIPLAYER_CONFIG } from '../constants'
import { Eyebrow } from '../../../shared/components/ui/Eyebrow'

interface MultiplayerInviteProps {
  inviteUrl: string
}

export function MultiplayerInvite({ inviteUrl }: MultiplayerInviteProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCopied(false)
  }, [inviteUrl])

  const copyInviteUrl = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), MULTIPLAYER_CONFIG.inviteCopiedDurationMs)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="multiplayer-invite multiplayer-invite-layout" role="region" aria-label={t('multiplayer.invite')}>
      <div className="multiplayer-invite-heading multiplayer-invite-heading-layout">
        <Eyebrow>{t('multiplayer.accessChannel')}</Eyebrow>
        <span className="multiplayer-invite-hint">{t('multiplayer.inviteHint')}</span>
      </div>
      <div className="multiplayer-invite-url multiplayer-invite-url-layout">
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
  )
}
