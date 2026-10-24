import { Maximize, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import type { GameState } from '../../types'

interface TopbarProps {
  state: GameState
  sound: boolean
  onToggleSound: () => void
  onFullscreen: () => void
  onReset: () => void
}

export function Topbar({ state, sound, onToggleSound, onFullscreen, onReset }: TopbarProps) {
  return (
    <header className="topbar ot-panel-surface">
      <div className="top-brand">
        <span className="mark">OT</span>
        <span>
          <b>UNDER ATTACK</b>
          <small>INDUSTRIAL CYBERSECURITY SIMULATOR</small>
        </span>
      </div>
      <div className="status-line">
        <span className="live">
          <i className="pulse-dot" /> LIVE
        </span>
        <span>04:0{state.currentScenario + 1}:12</span>
        <span>NODE / 07</span>
      </div>
      <div className="top-actions">
        <button className="ot-focus-ring" title="Sonido" onClick={onToggleSound}>
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button className="ot-focus-ring" title="Pantalla completa" onClick={onFullscreen}>
          <Maximize size={16} />
        </button>
        <button className="ot-focus-ring" title="Reiniciar" onClick={onReset}>
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  )
}
