import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '../../shared/components/ui/PrimaryButton'

interface WelcomeActionsProps {
  onStart: () => void
  onJoin: () => void
  onCreate: () => void
}

export function WelcomeActions({ onStart, onJoin, onCreate }: WelcomeActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="welcome-actions">
      <PrimaryButton onClick={onStart}>
        {t('common.start')} <ChevronRight size={18} />
      </PrimaryButton>
      <button type="button" className="secondary-btn" onClick={onJoin}>
        {t('multiplayer.join')}
      </button>
      <button type="button" className="text-btn" onClick={onCreate}>
        {t('multiplayer.create')}
      </button>
    </div>
  )
}
