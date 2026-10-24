import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ResultsActions } from '../components/results/ResultsActions'
import { ResultsHeader } from '../components/results/ResultsHeader'
import { ResultsStats } from '../components/results/ResultsStats'
import { ResultsSummary } from '../components/results/ResultsSummary'
import type { GameState } from '../types'
import { pageMotion, pageTransition } from '../animations/motionTokens'
import type { SimulationOutcome } from '../constants/domain'
import { DecisionHistory } from '../components/results/DecisionHistory'
import { countCorrectDecisions, getRankKey } from '../utils/results'

interface ResultsScreenProps {
  state: GameState
  outcome: SimulationOutcome
  showHistory: boolean
  onToggleHistory: () => void
  onReplay: () => void
}

export function ResultsScreen({ state, outcome, showHistory, onToggleHistory, onReplay }: ResultsScreenProps) {
  const { t } = useTranslation()
  const correctDecisions = countCorrectDecisions(state)
  const rankKey = getRankKey(correctDecisions)

  return (
    <motion.main className={`results ${outcome}`} {...pageMotion} transition={pageTransition}>
      <div className="results-orbit" />
      <div className="results-content">
        <ResultsHeader outcome={outcome} />
        <ResultsStats state={state} correctDecisions={correctDecisions} outcome={outcome} />
        <ResultsSummary rank={rankKey} />
        <ResultsActions showHistory={showHistory} onToggleHistory={onToggleHistory} onReplay={onReplay} />
        {showHistory && <DecisionHistory state={state} />}
        <p className="closing">{t('common.closing')}</p>
      </div>
    </motion.main>
  )
}
