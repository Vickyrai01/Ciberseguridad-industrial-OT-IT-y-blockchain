import type { GameState, ZoneState } from '../../types'

export interface PlantProps {
  state: GameState
  compact?: boolean
}

export interface PlantSvgIds {
  tankGradient: string
  tankClip: string
  glow: string
}

export interface PlantNodeProps {
  x: number | string
  y: number | string
  label: string
  sub: string
  icon: string
  state: ZoneState
}
