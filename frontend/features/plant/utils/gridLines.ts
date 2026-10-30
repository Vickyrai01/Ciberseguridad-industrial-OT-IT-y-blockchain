import { PLANT_GRID } from '../constants/plantLayout'

export interface GridLine {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
}

function createGridLines(): GridLine[] {
  const verticalLines = Array.from({ length: PLANT_GRID.columns }, (_, index) => {
    const position = index * PLANT_GRID.columnSize

    return {
      key: `v${index}`,
      x1: position,
      y1: 0,
      x2: position,
      y2: PLANT_GRID.height,
    }
  })

  const horizontalLines = Array.from({ length: PLANT_GRID.rows }, (_, index) => {
    const position = index * PLANT_GRID.rowSize

    return {
      key: `h${index}`,
      x1: 0,
      y1: position,
      x2: PLANT_GRID.width,
      y2: position,
    }
  })

  return [...verticalLines, ...horizontalLines]
}

export const PLANT_GRID_LINES = createGridLines()
