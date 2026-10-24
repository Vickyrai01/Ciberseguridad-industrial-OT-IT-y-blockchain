import { Maximize, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { GameState } from '../../types'
import { LanguageSwitcher } from './LanguageSwitcher'

interface TopbarProps {
  state: GameState
  sound: boolean
  onToggleSound: () => void
  onFullscreen: () => void
  onReset: () => void
}

export function Topbar({ state, sound, onToggleSound, onFullscreen, onReset }: TopbarProps) {
  const { t } = useTranslation()
  return (
    <header className="topbar ot-panel-surface">
      <div className="top-brand">
        <span className="mark">OT</span>
        <span>
          <b>OT UNDER ATTACK</b>
          <small>{t('common.simulator')}</small>
        </span>
      </div>
      <div className="status-line">
        <span className="live">
          <i className="pulse-dot" /> {t('common.live')}
        </span>
        <span>04:0{state.currentScenario + 1}:12</span>
        <span>NODE / 07</span>
      </div>
      <div className="top-actions">
        <LanguageSwitcher />
        <button className="ot-focus-ring" title={t('common.sound')} onClick={onToggleSound}>
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button className="ot-focus-ring" title={t('common.fullscreen')} onClick={onFullscreen}>
          <Maximize size={16} />
        </button>
        <button className="ot-focus-ring" title={t('common.restart')} onClick={onReset}>
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  )
}
