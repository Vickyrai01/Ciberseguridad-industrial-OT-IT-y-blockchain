import { PLANT_GRID_LINES } from '../utils/gridLines'

export function PlantGrid() {
  return (
    <g className="grid-lines">
      {PLANT_GRID_LINES.map(({ key, x1, y1, x2, y2 }) => (
        <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </g>
  )
}
