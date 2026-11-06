import { motion } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SIMULATION_CONFIG } from '../../../shared/constants/domain'
import { briefingMotion, briefingTransition } from '../../../animations/motionTokens'
import type { Choice, GameState, Scenario } from '../../../types'
import { ChoiceFeedback } from './ChoiceFeedback'

interface ScenarioBriefingProps {
  state: GameState
  scenario: Scenario
  selected: Choice['id'] | null
  onSelect: (choice: Choice) => void
  onContinue: () => void
  waitingForPresenter: boolean
  submitting: boolean
  error: string | null
}

export function ScenarioBriefing({
  state,
  scenario,
  selected,
  onSelect,
  onContinue,
  waitingForPresenter,
  submitting,
  error,
}: ScenarioBriefingProps) {
  const { t } = useTranslation()
  const selectedChoice = scenario.choices.find((choice) => choice.id === selected)
  const isLastScenario = state.currentScenario === SIMULATION_CONFIG.lastScenarioIndex

  return (
    <motion.div
      key={scenario.id}
      className="briefing ot-panel-surface"
      {...briefingMotion}
      transition={briefingTransition}>
      <div className="brief-kicker">{t(scenario.kickerKey)}</div>
      <h2>{t(scenario.titleKey)}</h2>
      <p className="narrative">{t(scenario.narrativeKey)}</p>
      <div className="question">
        <span>{t('common.yourCall')}</span>
        <p>{t(scenario.questionKey)}</p>
      </div>
      <div className="choices">
        {scenario.choices.map((choice, index) => (
          <button
            type="button"
            key={choice.id}
            className={`choice ot-focus-ring ${selected === choice.id ? 'chosen' : ''}`}
            onClick={() => onSelect(choice)}
            disabled={waitingForPresenter || submitting}
            aria-pressed={selected === choice.id}>
            <span className="choice-key">{String.fromCharCode(65 + index)}</span>
            <span>{t(choice.labelKey)}</span>
            {selected === choice.id && <Check size={16} />}
          </button>
        ))}
      </div>
      {selectedChoice && <ChoiceFeedback choice={selectedChoice} />}
      {error && (
        <p className="multiplayer-error" role="alert">
          {t(`multiplayer.errors.${error}` as never, { defaultValue: error })}
        </p>
      )}
      <button
        type="button"
        className="continue-btn ot-focus-ring"
        disabled={!selected || waitingForPresenter || submitting}
        onClick={onContinue}>
        {submitting
          ? t('multiplayer.submitting')
          : isLastScenario
            ? t('common.seeResult')
            : error
              ? t('common.retry')
              : t('common.applyDecision')}{' '}
        <ChevronRight size={17} />
      </button>
    </motion.div>
  )
}
