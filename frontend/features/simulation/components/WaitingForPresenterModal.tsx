import { Radio, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Eyebrow } from '../../../shared/components/ui/Eyebrow'

export function WaitingForPresenterModal() {
  const { t } = useTranslation()

  return (
    <div className="waiting-presenter-overlay waiting-overlay-layout" role="presentation">
      <section
        className="waiting-presenter-modal waiting-modal-layout"
        role="status"
        aria-live="polite"
        aria-label={t('multiplayer.waitingForPresenterTitle')}>
        <div className="waiting-presenter-signal waiting-signal-layout">
          <Radio size={18} aria-hidden="true" />
          <span>{t('multiplayer.live')}</span>
        </div>
        <div className="waiting-presenter-icon waiting-icon-layout" aria-hidden="true">
          <ShieldCheck size={28} />
        </div>
        <Eyebrow>{t('multiplayer.presenterSync')}</Eyebrow>
        <h2>{t('multiplayer.waitingForPresenterTitle')}</h2>
        <p>{t('multiplayer.waitingForPresenterCopy')}</p>
        <div className="waiting-presenter-progress waiting-progress-layout" aria-hidden="true">
          <span />
        </div>
      </section>
    </div>
  )
}
