import { Radio, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function WaitingForPresenterModal() {
  const { t } = useTranslation()

  return (
    <div className="waiting-presenter-overlay" role="presentation">
      <section
        className="waiting-presenter-modal"
        role="status"
        aria-live="polite"
        aria-label={t('multiplayer.waitingForPresenterTitle')}>
        <div className="waiting-presenter-signal">
          <Radio size={18} aria-hidden="true" />
          <span>{t('multiplayer.live')}</span>
        </div>
        <div className="waiting-presenter-icon" aria-hidden="true">
          <ShieldCheck size={28} />
        </div>
        <p className="eyebrow">{t('multiplayer.presenterSync')}</p>
        <h2>{t('multiplayer.waitingForPresenterTitle')}</h2>
        <p>{t('multiplayer.waitingForPresenterCopy')}</p>
        <div className="waiting-presenter-progress" aria-hidden="true">
          <span />
        </div>
      </section>
    </div>
  )
}
