import type { PlantNodeProps } from '../types'
import { wrapPlantLabel } from '../utils/plantText'

export function PlantNode({ x, y, label, sub, icon, state }: PlantNodeProps) {
  const labelLines = wrapPlantLabel(label)

  return (
    <g className={`node ${state}`} transform={`translate(${x} ${y})`}>
      <rect width="108" height="78" rx="7" />
      <circle cx="16" cy="17" r="6" />
      <text x="29" y="21">
        {icon.toUpperCase()}
      </text>
      <text x="10" y="38" className="node-label">
        {labelLines.map((line, index) => (
          <tspan x="10" dy={index === 0 ? 0 : 10} key={line}>
            {line}
          </tspan>
        ))}
      </text>
      <text x="10" y={labelLines.length > 1 ? 67 : 57} className="node-sub">
        {sub}
      </text>
    </g>
  )
}
