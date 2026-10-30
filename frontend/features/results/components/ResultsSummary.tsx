import { useTranslation } from 'react-i18next'
import type { TranslationKey } from '../../../i18n/types'

export function ResultsSummary({ rank }: { rank: TranslationKey }) {
  const { t } = useTranslation()

  return (
    <div className="rank-card">
      <span>{t('common.classification')}</span>
      <strong>{t(rank)}</strong>
      <small>{t('common.reflection')}</small>
    </div>
  )
}
