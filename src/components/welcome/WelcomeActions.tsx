import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface WelcomeActionsProps {
  presenter: boolean
  onStart: () => void
  onTogglePresenter: () => void
}

export function WelcomeActions({ presenter, onStart, onTogglePresenter }: WelcomeActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="welcome-actions">
      <button className="primary-btn" onClick={onStart}>
        {t('common.start')} <ChevronRight size={18} />
      </button>
      <button className={`text-btn ${presenter ? 'active' : ''}`} onClick={onTogglePresenter}>
        ◉ {t('common.presenterMode')}
      </button>
    </div>
  )
}
