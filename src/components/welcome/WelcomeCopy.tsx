import { useTranslation } from 'react-i18next'

export function WelcomeCopy() {
  const { t } = useTranslation()

  return (
    <div className="welcome-copy">
      <div className="time-mark">
        {t('common.startTime')} <span>·</span> {t('common.plantNode')}
      </div>
      <p>{t('welcome.hero')}</p>
      <p className="muted">{t('welcome.description')}</p>
    </div>
  )
}
