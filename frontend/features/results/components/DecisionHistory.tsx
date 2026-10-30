import { useTranslation } from 'react-i18next'
import { scenarios } from '../../simulation/data/scenarios'
import type { GameState } from '../../../types'

export function DecisionHistory({ state }: { state: GameState }) {
  const { t } = useTranslation()
  return (
    <div className="history">
      {state.scenarioOrder.map((scenarioId, index) => {
        const scenario = scenarios.find((item) => item.id === scenarioId)
        if (!scenario) return null
        const decision = state.decisionsHistory.find((item) => item.scenarioId === scenario.id)
        const selected = scenario.choices.find((choice) => choice.id === decision?.choiceId)
        return (
          <div className="history-row" key={scenario.id}>
            <span>0{index + 1}</span>
            <div>
              <strong>{t(scenario.titleKey)}</strong>
              <small>
                {t('common.selected')}: {selected ? t(selected.labelKey) : t('common.notAvailable')}
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
