import type { ZoneState } from '../../../types'

interface PlantConnectionsProps {
  firewall: ZoneState
  plc: ZoneState
  sis: ZoneState
}

export function PlantConnections({ firewall, plc, sis }: PlantConnectionsProps) {
  return (
    <>
      <g className={`connection ${firewall}`}>
        <path d="M125 115 H290 M350 115 H450 M515 115 H710" />
        <path d="M450 115 V225 H590" />
      </g>
      <g className={`connection ${plc}`}>
        <path d="M590 225 H710 M590 225 V345 H710" />
      </g>
      <g className={`connection ${sis}`}>
        <path d="M590 225 V130 H710" />
      </g>
      <g className="data-packets">
        <circle cx="190" cy="115" r="3" />
        <circle cx="399" cy="115" r="3" />
        <circle cx="650" cy="225" r="3" />
      </g>
    </>
  )
}
