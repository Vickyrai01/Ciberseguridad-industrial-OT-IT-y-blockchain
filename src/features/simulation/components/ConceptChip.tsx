import { useTranslation } from 'react-i18next'
import type { TranslationKey } from '../../../i18n/types'

interface ConceptChipProps {
  conceptKey: TranslationKey
  presenter: boolean
}

export function ConceptChip({ conceptKey, presenter }: ConceptChipProps) {
  const { t } = useTranslation()

  return (
    <div className="concept-chip">
      <span>{t('common.keyConcept')}</span>
      <strong>{t(conceptKey)}</strong>
      {presenter && <small>{t('common.suggestedTime')}</small>}
    </div>
  )
}
