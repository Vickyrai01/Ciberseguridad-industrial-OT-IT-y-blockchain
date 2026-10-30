import { ChevronRight, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'

interface ResultsActionsProps {
  showHistory: boolean
  onToggleHistory: () => void
  onReplay: () => void
}

export function ResultsActions({ showHistory, onToggleHistory, onReplay }: ResultsActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="results-actions">
      <PrimaryButton onClick={onReplay}>
        <RotateCcw size={16} /> {t('common.replay')}
      </PrimaryButton>
      <button type="button" className="secondary-btn" onClick={onToggleHistory} aria-expanded={showHistory}>
        {showHistory ? t('common.hideDecisions') : t('common.reviewDecisions')} <ChevronRight size={16} />
      </button>
    </div>
  )
}
