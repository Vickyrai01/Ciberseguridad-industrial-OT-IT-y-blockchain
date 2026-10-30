import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface WelcomeActionsProps {
  presenter: boolean
  onStart: () => void
  onTogglePresenter: () => void
  onJoin: () => void
  onCreate: () => void
}

export function WelcomeActions({ presenter, onStart, onTogglePresenter, onJoin, onCreate }: WelcomeActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="welcome-actions">
      <button type="button" className="primary-btn" onClick={onStart}>
        {t('common.start')} <ChevronRight size={18} />
      </button>
      <button type="button" className="secondary-btn" onClick={onJoin}>
        {t('multiplayer.join')}
      </button>
      <button type="button" className="text-btn" onClick={onCreate}>
        {t('multiplayer.create')}
      </button>
      <button
        type="button"
        className={`text-btn ${presenter ? 'active' : ''}`}
        onClick={onTogglePresenter}
        aria-pressed={presenter}>
        ◉ {t('common.presenterMode')}
      </button>
    </div>
  )
}
