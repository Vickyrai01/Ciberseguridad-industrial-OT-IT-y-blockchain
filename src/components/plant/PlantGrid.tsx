export function PlantGrid() {
  return (
    <g className="grid-lines">
      {Array.from({ length: 18 }).map((_, index) => (
        <line key={`v${index}`} x1={index * 50} y1="0" x2={index * 50} y2="445" />
      ))}
      {Array.from({ length: 10 }).map((_, index) => (
        <line key={`h${index}`} x1="0" y1={index * 50} x2="900" y2={index * 50} />
      ))}
    </g>
  )
}
