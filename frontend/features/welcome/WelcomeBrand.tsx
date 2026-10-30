import { useTranslation } from 'react-i18next'

export function WelcomeBrand() {
  const { t } = useTranslation()

  return (
    <div className="brand-lockup">
      <span className="eyebrow">
        <span className="pulse-dot" /> {t('common.liveSimulation')}
      </span>
      <h1>
        OT <span>UNDER</span> ATTACK
      </h1>
      <p>{t('common.simulator')}</p>
    </div>
  )
}
