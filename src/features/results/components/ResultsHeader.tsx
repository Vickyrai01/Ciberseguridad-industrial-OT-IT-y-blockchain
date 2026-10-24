import { useTranslation } from 'react-i18next'
import type { SimulationOutcome } from '../../../shared/constants/domain'
import { getResultCopyKeys } from '../utils/results'

export function ResultsHeader({ outcome }: { outcome: SimulationOutcome }) {
  const { t } = useTranslation()
  const { titleKey, subtitleKey } = getResultCopyKeys(outcome)

  return (
    <>
      <div className="eyebrow">
        <span className="pulse-dot" /> {t('common.simulationComplete')}
      </div>
      <h1>{t(titleKey)}</h1>
      <p className="results-sub">{t(subtitleKey)}</p>
    </>
  )
}
