import { useTranslation } from 'react-i18next'
import { Eyebrow } from '../../shared/components/ui/Eyebrow'

export function WelcomeBrand() {
  const { t } = useTranslation()

  return (
    <div className="brand-lockup">
      <Eyebrow pulse>{t('common.liveSimulation')}</Eyebrow>
      <h1>
        OT <span>UNDER</span> ATTACK
      </h1>
      <p>{t('common.simulator')}</p>
    </div>
  )
}
