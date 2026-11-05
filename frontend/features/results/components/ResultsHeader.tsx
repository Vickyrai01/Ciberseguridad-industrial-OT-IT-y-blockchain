import { useTranslation } from 'react-i18next'
import type { SimulationOutcome } from '../../../shared/constants/domain'
import { getResultCopyKeys } from '../utils/results'
import { Eyebrow } from '../../../shared/components/ui/Eyebrow'

export function ResultsHeader({ outcome }: { outcome: SimulationOutcome }) {
  const { t } = useTranslation()
  const { titleKey, subtitleKey } = getResultCopyKeys(outcome)

  return (
    <>
      <Eyebrow pulse>{t('common.simulationComplete')}</Eyebrow>
      <h1>{t(titleKey)}</h1>
      <p className="results-sub">{t(subtitleKey)}</p>
    </>
  )
}
