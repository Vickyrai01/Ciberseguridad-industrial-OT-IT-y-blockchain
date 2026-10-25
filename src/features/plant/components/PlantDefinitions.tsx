import type { PlantSvgIds } from '../types'

export function PlantDefinitions({ ids }: { ids: PlantSvgIds }) {
  return (
    <defs>
      <linearGradient id={ids.tankGradient} x1="0" x2="1">
        <stop stopColor="#15242d" />
        <stop offset=".5" stopColor="#2a3d46" />
        <stop offset="1" stopColor="#0b151c" />
      </linearGradient>
      <filter id={ids.glow}>
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  )
}
