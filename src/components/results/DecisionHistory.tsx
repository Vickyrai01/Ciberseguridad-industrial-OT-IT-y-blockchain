import { useTranslation } from 'react-i18next'
import { scenarios } from '../../data/scenarios'
import type { GameState } from '../../types'

export function DecisionHistory({ state }: { state: GameState }) {
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
