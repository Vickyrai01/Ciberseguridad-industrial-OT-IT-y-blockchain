import { useTranslation } from 'react-i18next'
import { SIMULATION_CONFIG } from '../../../shared/constants/domain'
import type { Scenario } from '../../../types'
import { Eyebrow } from '../../../shared/components/ui/Eyebrow'

export function ScenarioProgress({ scenario }: { scenario: Scenario }) {
  const { t } = useTranslation()
  const progress = (scenario.id / SIMULATION_CONFIG.scenarioCount) * 100

  return (
    <div className="scenario-progress scenario-progress-layout">
      <div>
        <Eyebrow>{t('common.threatBriefing')}</Eyebrow>
        <strong>
          {String(scenario.id).padStart(2, '0')}{' '}
          <small>/ {String(SIMULATION_CONFIG.scenarioCount).padStart(2, '0')}</small>
        </strong>
      </div>
      <div className="progress-track progress-track-layout">
        <span className="progress-fill-layout" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
