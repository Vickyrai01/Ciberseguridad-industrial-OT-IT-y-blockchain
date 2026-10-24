import type { GameState, ZoneState } from '../../types'
import { useTranslation } from 'react-i18next'
import { PLANT_ZONE, ZONE_STATE } from '../../constants/domain'

interface NodeProps {
  x: number | string
  y: number | string
  label: string
  sub: string
  icon: string
  state: ZoneState
}

export function Plant({ state, compact = false }: { state: GameState; compact?: boolean }) {
  const { t } = useTranslation()
  const zone = (name: keyof typeof PLANT_ZONE): ZoneState => state.zones[PLANT_ZONE[name]] ?? ZONE_STATE.STABLE
  return (
    <div className={`plant ${compact ? 'compact' : ''}`}>
      <div className="plant-noise" />
      <div className="zone-label it">
        {t('plant.itZone')} <span>{t('plant.trustLevel')}</span>
      </div>
      <div className="zone-label ot">
        {t('plant.otZone')} <span>{t('plant.processControl')}</span>
      </div>
      <div className="zone-label safety">
        {t('plant.safety')} <span>{t('plant.isolatedLayer')}</span>
      </div>
      <svg viewBox="0 0 900 445" role="img" aria-label={t('plant.diagramLabel')} className="plant-svg">
        <defs>
          <linearGradient id="tank" x1="0" x2="1">
            <stop stopColor="#15242d" />
            <stop offset=".5" stopColor="#2a3d46" />
            <stop offset="1" stopColor="#0b151c" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g className="grid-lines">
          {Array.from({ length: 18 }).map((_, index) => (
            <line key={`v${index}`} x1={index * 50} y1="0" x2={index * 50} y2="445" />
          ))}
          {Array.from({ length: 10 }).map((_, index) => (
            <line key={`h${index}`} x1="0" y1={index * 50} x2="900" y2={index * 50} />
          ))}
        </g>
        <g className={`connection ${zone('FIREWALL')}`}>
          <path d="M125 115 H290 M350 115 H450 M515 115 H710" />
          <path d="M450 115 V225 H590" />
        </g>
        <g className={`connection ${zone('PLC')}`}>
          <path d="M590 225 H710 M590 225 V345 H710" />
        </g>
        <g className={`connection ${zone('SIS')}`}>
          <path d="M590 225 V130 H710" />
        </g>
        <g className="data-packets">
          <circle cx="190" cy="115" r="3" />
          <circle cx="399" cy="115" r="3" />
          <circle cx="650" cy="225" r="3" />
        </g>
        <PlantNode
          x="70"
          y="78"
          label={t('plant.corpServer')}
          sub="ERP-01"
          icon={t('plant.server')}
          state={zone('ERP')}
        />
        <PlantNode
          x="300"
          y="78"
          label={t('plant.remoteAccess')}
          sub={t('plant.vpnGateway')}
          icon={t('plant.lock')}
          state={ZONE_STATE.STABLE}
        />
        <PlantNode
          x="435"
          y="78"
          label={t('plant.industrialDmz')}
          sub={t('plant.allowlist')}
          icon={t('plant.firewall')}
          state={zone('FIREWALL')}
        />
        <PlantNode
          x="700"
          y="78"
          label={t('plant.scadaCore')}
          sub={t('plant.scadaOnline')}
          icon={t('plant.monitor')}
          state={ZONE_STATE.STABLE}
        />
        <PlantNode
          x="530"
          y="190"
          label={t('plant.hmiStation')}
          sub={t('plant.hmiOperator')}
          icon={t('plant.monitor')}
          state={ZONE_STATE.STABLE}
        />
        <PlantNode
          x="700"
          y="190"
          label={t('plant.safetySis')}
          sub={t('plant.sisArmed')}
          icon={t('plant.shield')}
          state={zone('SIS')}
        />
        <PlantNode
          x="530"
          y="310"
          label={t('plant.plcController')}
          sub={t('plant.plcRun')}
          icon={t('plant.chip')}
          state={zone('PLC')}
        />
        <g className="process">
          <rect x="705" y="285" width="92" height="107" rx="16" fill="url(#tank)" stroke="#4e7074" />
          <path d="M710 340 Q750 325 793 340 V381 H710Z" fill="#2b7d78" className="liquid" />
          <path d="M796 350 H850 V368 H796 M820 350 V308 H850" fill="none" stroke="#4e7074" strokeWidth="9" />
          <circle cx="748" cy="257" r="18" fill="#15242d" stroke="#e4b354" />
          <circle cx="748" cy="257" r="6" fill="#6fe0b0" className="pump-light" />
          <text x="715" y="414">
            {t('plant.tankProcess')}
          </text>
          <text x="715" y="429" className="sensor-read">
            {t('plant.sensorRead')}
          </text>
        </g>
        <g className="sensor-lines">
          <path d="M800 290 V225 H860" />
          <circle cx="860" cy="225" r="8" />
          <text x="835" y="210">
            {t('plant.sensor')}
          </text>
        </g>
      </svg>
    </div>
  )
}

function PlantNode({ x, y, label, sub, icon, state }: NodeProps) {
  return (
    <g className={`node ${state}`} transform={`translate(${x} ${y})`}>
      <rect width="108" height="68" rx="7" />
      <circle cx="16" cy="17" r="6" />
      <text x="29" y="21">
        {icon.toUpperCase()}
      </text>
      <text x="10" y="43" className="node-label">
        {label}
      </text>
      <text x="10" y="57" className="node-sub">
        {sub}
      </text>
    </g>
  )
}
