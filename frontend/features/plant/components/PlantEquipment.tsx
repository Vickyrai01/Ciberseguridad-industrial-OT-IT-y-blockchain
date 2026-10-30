import { useTranslation } from 'react-i18next'
import { PLANT_ZONE, ZONE_STATE } from '../../../shared/constants/domain'
import type { ZoneState } from '../../../types'
import { PLANT_NODES } from '../data/plantNodes'
import { PLANT_NODE_LAYOUT } from '../constants/plantLayout'
import { PlantNode } from './PlantNode'

interface PlantEquipmentProps {
  zone: (name: keyof typeof PLANT_ZONE) => ZoneState
}

export function PlantEquipment({ zone }: PlantEquipmentProps) {
  const { t } = useTranslation()

  return (
    <>
      {PLANT_NODES.map((node) => {
        const position = PLANT_NODE_LAYOUT[node.layout]
        const label = t(node.label)
        const sub = node.sub.type === 'translation' ? t(node.sub.key) : node.sub.value
        const icon = t(node.icon)

        return (
          <PlantNode
            key={node.layout}
            x={position.x}
            y={position.y}
            label={label}
            sub={sub}
            icon={icon}
            state={node.zone ? zone(node.zone) : ZONE_STATE.STABLE}
          />
        )
      })}
    </>
  )
}
