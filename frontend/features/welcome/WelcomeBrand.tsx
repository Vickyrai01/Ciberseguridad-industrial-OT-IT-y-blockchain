import { useTranslation } from 'react-i18next'
import { Eyebrow } from '../../shared/components/ui/Eyebrow'

export function WelcomeBrand() {
  const { t } = useTranslation()

  return (
    <div className="brand-lockup brand-lockup-layout">
      <Eyebrow pulse>{t('common.liveSimulation')}</Eyebrow>
      <h1 className="brand-title-layout">
        OT <span>UNDER</span> ATTACK
      </h1>
      <p className="brand-subtitle-layout">{t('common.simulator')}</p>
    </div>
  )
}
