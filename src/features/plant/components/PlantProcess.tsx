import { useTranslation } from 'react-i18next'
import { PlantOutlet } from './PlantOutlet'
import { PlantPump } from './PlantPump'
import { PlantTank } from './PlantTank'
import type { PlantSvgIds } from '../types'

interface PlantProcessProps {
  ids: PlantSvgIds
}

export function PlantProcess({ ids }: PlantProcessProps) {
  const { t } = useTranslation()

  return (
    <g className="process">
      <PlantTank ids={ids} />
      <PlantOutlet />
      <PlantPump />
      <text x="715" y="414">
        {t('plant.tankProcess')}
      </text>
      <text x="715" y="429" className="sensor-read">
        {t('plant.sensorRead')}
      </text>
    </g>
  )
}
