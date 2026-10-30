import { CircleDot } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { AppController } from './useAppController'

interface AppControlsProps {
  simulation: AppController['simulation']
}

export function AppControls({ simulation }: AppControlsProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      className="floating-help"
      title={t('common.controls')}
      aria-label={t('common.controls')}
      aria-pressed={simulation.presenter}
      onClick={simulation.togglePresenter}>
      <CircleDot size={16} />
    </button>
  )
}
