import type { ZoneState } from '../../../types'
import { PLANT_CONNECTIONS } from '../constants/plantLayout'

interface PlantConnectionsProps {
  firewall: ZoneState
  plc: ZoneState
  sis: ZoneState
}

export function PlantConnections({ firewall, plc, sis }: PlantConnectionsProps) {
  const connectionStates = { firewall, plc, sis }

  return (
    <>
      {PLANT_CONNECTIONS.map(({ key, paths }) => (
        <g className={`connection ${connectionStates[key]}`} key={key}>
          {paths.map((path) => (
            <path d={path} key={path} />
          ))}
        </g>
      ))}
    </>
  )
}
