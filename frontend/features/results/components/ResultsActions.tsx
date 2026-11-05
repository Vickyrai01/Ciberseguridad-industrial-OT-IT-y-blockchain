import { ChevronRight, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../shared/components/ui/Button'

interface ResultsActionsProps {
  showHistory: boolean
  onToggleHistory: () => void
  onReplay: () => void
}

export function ResultsActions({ showHistory, onToggleHistory, onReplay }: ResultsActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="results-actions">
      <Button onClick={onReplay}>
        <RotateCcw size={16} /> {t('common.replay')}
      </Button>
      <Button variant="secondary" onClick={onToggleHistory} aria-expanded={showHistory}>
        {showHistory ? t('common.hideDecisions') : t('common.reviewDecisions')} <ChevronRight size={16} />
      </Button>
    </div>
  )
}
