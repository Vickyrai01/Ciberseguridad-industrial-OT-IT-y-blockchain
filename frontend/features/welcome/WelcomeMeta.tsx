import { useTranslation } from 'react-i18next'
import { SIMULATION_CONFIG } from '../../shared/constants/domain'

export function WelcomeMeta() {
  const { t } = useTranslation()

  return (
    <div className="welcome-meta absolute bottom-9 left-[7vw] right-[7vw] flex gap-7 font-mono text-[10px] tracking-[0.12em] text-ot-meta max-[900px]:relative max-[900px]:inset-auto max-[900px]:mt-10 max-[900px]:flex-wrap">
      <span>
        {SIMULATION_CONFIG.scenarioCount} {t('common.decisions')}
      </span>
      <span>{t('common.minutes')}</span>
      <span>{t('common.educational')}</span>
      <span>{t('common.group')}</span>
    </div>
  )
}
