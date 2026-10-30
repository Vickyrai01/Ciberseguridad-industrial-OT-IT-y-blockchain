import { useTranslation } from 'react-i18next'
import { SIMULATION_CONFIG } from '../../shared/constants/domain'

export function WelcomeMeta() {
  const { t } = useTranslation()

  return (
    <div className="welcome-meta">
      <span>
        {SIMULATION_CONFIG.scenarioCount} {t('common.decisions')}
      </span>
      <span>{t('common.minutes')}</span>
      <span>{t('common.educational')}</span>
      <span>{t('common.group')}</span>
    </div>
  )
}
