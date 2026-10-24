import type { ZoneState } from '../../../types'

export interface PlantNodeProps {
  x: number | string
  y: number | string
  label: string
  sub: string
  icon: string
  state: ZoneState
}

function wrapLabel(label: string, maxLength = 15) {
  const words = label.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word

    if (currentLine && nextLine.length > maxLength) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = nextLine
    }
  }

  if (currentLine) lines.push(currentLine)
  return lines
}

export function PlantNode({ x, y, label, sub, icon, state }: PlantNodeProps) {
  return (
    <g className={`node ${state}`} transform={`translate(${x} ${y})`}>
      <rect width="108" height="78" rx="7" />
      <circle cx="16" cy="17" r="6" />
      <text x="29" y="21">
        {icon.toUpperCase()}
      </text>
      <text x="10" y="38" className="node-label">
        {wrapLabel(label).map((line, index) => (
          <tspan x="10" dy={index === 0 ? 0 : 10} key={line}>
            {line}
          </tspan>
        ))}
      </text>
      <text x="10" y={wrapLabel(label).length > 1 ? 67 : 57} className="node-sub">
        {sub}
      </text>
    </g>
  )
}
