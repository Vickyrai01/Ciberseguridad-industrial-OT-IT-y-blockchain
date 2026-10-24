import { ChevronRight, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ResultsActionsProps {
  showHistory: boolean
  onToggleHistory: () => void
  onReplay: () => void
}

export function ResultsActions({ showHistory, onToggleHistory, onReplay }: ResultsActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="results-actions">
      <button className="primary-btn" onClick={onReplay}>
        <RotateCcw size={16} /> {t('common.replay')}
      </button>
      <button className="secondary-btn" onClick={onToggleHistory}>
        {showHistory ? t('common.hideDecisions') : t('common.reviewDecisions')} <ChevronRight size={16} />
      </button>
    </div>
  )
}
