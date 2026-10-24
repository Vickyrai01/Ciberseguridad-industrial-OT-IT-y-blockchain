import { ChevronRight, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { scenarios } from '../data/scenarios'
import { Stat } from '../components/dashboard/Stat'
import type { GameState } from '../types'

interface ResultsScreenProps {
  state: GameState
  outcome: 'controlled' | 'contingency' | 'critical'
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
    outcome === 'controlled'
      ? t('common.controlledTitle')
      : outcome === 'critical'
        ? t('common.criticalTitle')
        : t('common.contingencyTitle')
  const rank =
    correct === 5
      ? t('common.resilienceArchitect')
      : correct >= 3
        ? t('common.industrialSpecialist')
        : correct >= 1
          ? t('common.juniorAnalyst')
          : t('common.insiderThreat')
  return (
    <motion.main className={`results ${outcome}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="results-orbit" />
      <div className="results-content">
        <div className="eyebrow">
          <span className="pulse-dot" /> {t('common.simulationComplete')}
        </div>
        <h1>{title}</h1>
        <p className="results-sub">
          {outcome === 'controlled'
            ? t('common.controlledSubtitle')
            : outcome === 'critical'
              ? t('common.criticalSubtitle')
              : t('common.contingencySubtitle')}
        </p>
        <div className="result-stats">
          <Stat
            label={t('common.security')}
            value={state.security}
            suffix="/ 100"
            tone={outcome === 'critical' ? 'red' : 'green'}
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

function DecisionHistory({ state }: { state: GameState }) {
  const { t } = useTranslation()
  return (
    <div className="history">
      {scenarios.map((scenario, index) => {
        const selected = scenario.choices.find((choice) => choice.id === state.selectedAnswers[index])
        return (
          <div className="history-row" key={scenario.id}>
            <span>0{scenario.id}</span>
            <div>
              <strong>{t(scenario.titleKey)}</strong>
              <small>
                {t('common.selected')}: {selected ? t(selected.labelKey) : '—'}
              </small>
              <small className="recommendation">
                {t('common.recommendedAnswer')}:{' '}
                {t(scenario.choices.find((choice) => choice.recommended)?.labelKey ?? '')}
              </small>
            </div>
          </div>
        )
      })}
    </div>
  )
}
