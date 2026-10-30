import { useTranslation } from 'react-i18next'
import type { TranslationKey } from '../../../i18n/types'

interface ConceptChipProps {
  conceptKey: TranslationKey
}

export function ConceptChip({ conceptKey }: ConceptChipProps) {
  const { t } = useTranslation()

  return (
    <div className="concept-chip">
      <span>{t('common.keyConcept')}</span>
      <strong>{t(conceptKey)}</strong>
    </div>
  )
}
