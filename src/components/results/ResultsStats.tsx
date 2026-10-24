import { useTranslation } from 'react-i18next'
import { SIMULATION_CONFIG, SIMULATION_OUTCOME, type SimulationOutcome } from '../../constants/domain'
import type { GameState } from '../../types'
import { Stat } from '../dashboard/Stat'

interface ResultsStatsProps {
  state: GameState
  correctDecisions: number
  outcome: SimulationOutcome
}

export function ResultsStats({ state, correctDecisions, outcome }: ResultsStatsProps) {
  const { t } = useTranslation()

  return (
    <div className="result-stats">
      <Stat
        label={t('common.security')}
        value={state.security}
        suffix="/ 100"
        tone={outcome === SIMULATION_OUTCOME.CRITICAL ? 'red' : 'green'}
      />
      <Stat label={t('common.production')} value={state.production} suffix="%" tone="cyan" />
      <Stat label={t('common.systemsCompromised')} value={state.compromisedSystems} suffix="" tone="orange" />
      <div className="result-stat">
        <span>{t('common.decisions')}</span>
        <strong>
          {correctDecisions}
          <small>/ {SIMULATION_CONFIG.scenarioCount}</small>
        </strong>
      </div>
    </div>
  )
}
