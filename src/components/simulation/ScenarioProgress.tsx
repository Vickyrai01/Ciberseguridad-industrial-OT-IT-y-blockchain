import { useTranslation } from 'react-i18next'
import { SIMULATION_CONFIG } from '../../constants/domain'
import type { Scenario } from '../../types'

export function ScenarioProgress({ scenario }: { scenario: Scenario }) {
  const { t } = useTranslation()
  const progress = (scenario.id / SIMULATION_CONFIG.scenarioCount) * 100

  return (
    <div className="scenario-progress">
      <div>
        <span className="eyebrow">{t('common.threatBriefing')}</span>
        <strong>
          {String(scenario.id).padStart(2, '0')}{' '}
          <small>/ {String(SIMULATION_CONFIG.scenarioCount).padStart(2, '0')}</small>
        </strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
