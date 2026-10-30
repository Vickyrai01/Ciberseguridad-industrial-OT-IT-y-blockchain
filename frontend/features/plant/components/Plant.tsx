import { useId, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { PLANT_VIEWBOX } from '../constants/plantLayout'
import { PlantConnections } from './PlantConnections'
import { PlantDefinitions } from './PlantDefinitions'
import { PlantEquipment } from './PlantEquipment'
import { PlantGrid } from './PlantGrid'
import { PlantHeader } from './PlantHeader'
import { PlantProcess } from './PlantProcess'
import { PlantSensor } from './PlantSensor'
import type { PlantProps } from '../types'
import { createPlantSvgIds, getPlantZoneState } from '../utils/plant'

export function Plant({ state, compact = false }: PlantProps) {
  const { t } = useTranslation()
  const instanceId = useId()
  const ids = createPlantSvgIds(instanceId)
  const zone = (name: Parameters<typeof getPlantZoneState>[1]) => getPlantZoneState(state, name)
  const plantStyle = { '--plant-glow-filter': `url(#${ids.glow})` } as CSSProperties

  return (
    <div className={`relative h-full min-h-[250px] w-full ${compact ? 'compact' : ''}`} style={plantStyle}>
      <div className="plant-noise" />
      <PlantHeader />
      <svg
        viewBox={PLANT_VIEWBOX}
        role="img"
        aria-label={t('plant.diagramLabel')}
        className="relative z-[1] block h-full w-full">
        <PlantDefinitions ids={ids} />
        <PlantGrid />
        <PlantConnections firewall={zone('FIREWALL')} plc={zone('PLC')} sis={zone('SIS')} />
        <PlantEquipment zone={zone} />
        <PlantProcess ids={ids} />
        <PlantSensor />
      </svg>
    </div>
  )
}
