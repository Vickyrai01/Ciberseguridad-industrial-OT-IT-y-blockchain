import type { GameState, ZoneState } from '../../../types'
import { PLANT_ZONE, ZONE_STATE } from '../../../shared/constants/domain'
import type { PlantSvgIds } from '../types'

export function createPlantSvgIds(instanceId: string): PlantSvgIds {
  const safeInstanceId = instanceId.replace(/:/g, '')

  return {
    tankGradient: `${safeInstanceId}-tank-gradient`,
    tankClip: `${safeInstanceId}-tank-clip`,
    glow: `${safeInstanceId}-glow`,
  }
}

export function getPlantZoneState(state: GameState, name: keyof typeof PLANT_ZONE): ZoneState {
  return state.zones[PLANT_ZONE[name]] ?? ZONE_STATE.STABLE
}
