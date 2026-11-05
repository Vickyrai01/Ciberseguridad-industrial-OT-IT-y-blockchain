import { useTranslation } from 'react-i18next'
import { SIMULATION_CONFIG, SIMULATION_OUTCOME, type SimulationOutcome } from '../../../shared/constants/domain'
import type { GameState } from '../../../types'
import { MetricCard } from './MetricCard'

interface ResultsStatsProps {
  state: GameState
  correctDecisions: number
  outcome: SimulationOutcome
}

export function ResultsStats({ state, correctDecisions, outcome }: ResultsStatsProps) {
  const { t } = useTranslation()

  return (
    <div className="result-stats">
      <MetricCard
        label={t('common.security')}
        value={state.security}
        suffix="/ 100"
        tone={outcome === SIMULATION_OUTCOME.CRITICAL ? 'red' : 'green'}
        meterValue={state.security}
      />
      <MetricCard
        label={t('common.production')}
        value={state.production}
        suffix="%"
        tone="cyan"
        meterValue={state.production}
      />
      <MetricCard
        label={t('common.systemsCompromised')}
        value={state.compromisedSystems}
        suffix=""
        tone="orange"
        meterValue={state.compromisedSystems}
      />
      <MetricCard
        label={t('common.decisions')}
        value={correctDecisions}
        suffix={`/ ${SIMULATION_CONFIG.scenarioCount}`}
      />
    </div>
  )
}
