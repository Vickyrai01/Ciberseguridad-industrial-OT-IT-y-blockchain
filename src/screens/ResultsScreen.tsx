import { ChevronRight, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { scenarios } from '../data/scenarios'
import { Stat } from '../components/dashboard/Stat'
import type { GameState } from '../types'
import { pageMotion, pageTransition } from '../animations/motionTokens'
import { SIMULATION_CONFIG, SIMULATION_OUTCOME, type SimulationOutcome } from '../constants/domain'
import { DecisionHistory } from '../components/results/DecisionHistory'

interface ResultsScreenProps {
  state: GameState
  outcome: SimulationOutcome
  showHistory: boolean
  onToggleHistory: () => void
  onReplay: () => void
}

export function ResultsScreen({ state, outcome, showHistory, onToggleHistory, onReplay }: ResultsScreenProps) {
  const { t } = useTranslation()
  const correct = state.decisionsHistory.filter(
    (entry, index) => scenarios[index].choices.find((choice) => choice.id === entry.choice)?.recommended,
  ).length
  const title =
    outcome === SIMULATION_OUTCOME.CONTROLLED
      ? t('common.controlledTitle')
      : outcome === SIMULATION_OUTCOME.CRITICAL
        ? t('common.criticalTitle')
        : t('common.contingencyTitle')
  const rank =
    correct === SIMULATION_CONFIG.scenarioCount
      ? t('common.resilienceArchitect')
      : correct >= SIMULATION_CONFIG.specialistCorrectThreshold
        ? t('common.industrialSpecialist')
        : correct >= SIMULATION_CONFIG.juniorCorrectThreshold
          ? t('common.juniorAnalyst')
          : t('common.insiderThreat')
  return (
    <motion.main className={`results ${outcome}`} {...pageMotion} transition={pageTransition}>
      <div className="results-orbit" />
      <div className="results-content">
        <div className="eyebrow">
          <span className="pulse-dot" /> {t('common.simulationComplete')}
        </div>
        <h1>{title}</h1>
        <p className="results-sub">
          {outcome === SIMULATION_OUTCOME.CONTROLLED
            ? t('common.controlledSubtitle')
            : outcome === SIMULATION_OUTCOME.CRITICAL
              ? t('common.criticalSubtitle')
              : t('common.contingencySubtitle')}
        </p>
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
              {correct}
              <small>/ 5</small>
            </strong>
          </div>
        </div>
        <div className="rank-card">
          <span>{t('common.classification')}</span>
          <strong>{rank}</strong>
          <small>{t('common.reflection')}</small>
        </div>
        <div className="results-actions">
          <button className="primary-btn" onClick={onReplay}>
            <RotateCcw size={16} /> {t('common.replay')}
          </button>
          <button className="secondary-btn" onClick={onToggleHistory}>
            {showHistory ? t('common.hideDecisions') : t('common.reviewDecisions')} <ChevronRight size={16} />
          </button>
        </div>
        {showHistory && <DecisionHistory state={state} />}
        <p className="closing">{t('common.closing')}</p>
      </div>
    </motion.main>
  )
}
