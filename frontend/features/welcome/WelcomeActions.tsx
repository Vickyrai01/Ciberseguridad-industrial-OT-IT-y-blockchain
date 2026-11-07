import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/components/ui/Button'

interface WelcomeActionsProps {
  onStart: () => void
  onJoin: () => void
  onCreate: () => void
}

export function WelcomeActions({ onStart, onJoin, onCreate }: WelcomeActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="welcome-actions relative z-[1] flex items-center gap-6 max-[520px]:flex-col max-[520px]:items-start max-[520px]:gap-2">
      <Button onClick={onStart}>
        {t('common.start')} <ChevronRight size={18} />
      </Button>
      <Button variant="secondary" onClick={onJoin}>
        {t('multiplayer.join')}
      </Button>
      <Button variant="text" onClick={onCreate}>
        {t('multiplayer.create')}
      </Button>
    </div>
  )
}
