import type { GameState, ZoneState } from '../../types'
import { useTranslation } from 'react-i18next'
import { PLANT_ZONE, ZONE_STATE } from '../../constants/domain'
import { PlantConnections } from './PlantConnections'
import { PlantEquipment } from './PlantEquipment'
import { PlantGrid } from './PlantGrid'
import { PlantProcess } from './PlantProcess'
import { PlantSensor } from './PlantSensor'

export function Plant({ state, compact = false }: { state: GameState; compact?: boolean }) {
  const { t } = useTranslation()
  const zone = (name: keyof typeof PLANT_ZONE): ZoneState => state.zones[PLANT_ZONE[name]] ?? ZONE_STATE.STABLE
  return (
    <div className={`relative h-full min-h-[250px] w-full ${compact ? 'compact' : ''}`}>
      <div className="plant-noise" />
      <div className="absolute left-[3%] top-[14px] z-[2] font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a9ba0] max-[520px]:text-[7px]">
        {t('plant.itZone')}{' '}
        <span className="mt-[3px] block text-[8px] tracking-[0.1em] text-[#506e75] max-[520px]:text-[6px]">
          {t('plant.trustLevel')}
        </span>
      </div>
      <div className="absolute right-[28%] top-[14px] z-[2] font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a9ba0] max-[520px]:text-[7px]">
        {t('plant.otZone')}{' '}
        <span className="mt-[3px] block text-[8px] tracking-[0.1em] text-[#506e75] max-[520px]:text-[6px]">
          {t('plant.processControl')}
        </span>
      </div>
      <div className="absolute right-[3%] top-[14px] z-[2] font-mono text-[10px] uppercase tracking-[0.1em] text-ot-yellow max-[520px]:text-[7px]">
        {t('plant.safety')}{' '}
        <span className="mt-[3px] block text-[8px] tracking-[0.1em] text-[#506e75] max-[520px]:text-[6px]">
          {t('plant.isolatedLayer')}
        </span>
      </div>
      <svg
        viewBox="0 0 900 445"
        role="img"
        aria-label={t('plant.diagramLabel')}
        className="relative z-[1] block h-full w-full">
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
        <PlantGrid />
        <PlantConnections firewall={zone('FIREWALL')} plc={zone('PLC')} sis={zone('SIS')} />
        <PlantEquipment zone={zone} />
        <PlantProcess />
        <PlantSensor />
      </svg>
    </div>
  )
}
