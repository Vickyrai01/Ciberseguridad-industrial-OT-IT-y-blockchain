import type { ZoneState } from '../../../types'

export interface PlantNodeProps {
  x: number | string
  y: number | string
  label: string
  sub: string
  icon: string
  state: ZoneState
}

export function PlantNode({ x, y, label, sub, icon, state }: PlantNodeProps) {
  return (
    <g className={`node ${state}`} transform={`translate(${x} ${y})`}>
      <rect width="108" height="68" rx="7" />
      <circle cx="16" cy="17" r="6" />
      <text x="29" y="21">
        {icon.toUpperCase()}
      </text>
      <text x="10" y="43" className="node-label">
        {label}
      </text>
      <text x="10" y="57" className="node-sub">
        {sub}
      </text>
    </g>
  )
}
