import type { TranslationKey } from '../../../i18n/types'
import { PLANT_ZONE } from '../../../shared/constants/domain'
import { PLANT_NODE_LAYOUT } from '../constants/plantLayout'

export interface PlantNodeDefinition {
  layout: keyof typeof PLANT_NODE_LAYOUT
  label: TranslationKey
  sub: { type: 'translation'; key: TranslationKey } | { type: 'technical'; value: string }
  icon: TranslationKey
  zone?: keyof typeof PLANT_ZONE
}

export const PLANT_NODES: PlantNodeDefinition[] = [
  {
    layout: 'corpServer',
    label: 'plant.corpServer',
    sub: { type: 'technical', value: 'ERP-01' },
    icon: 'plant.server',
    zone: 'ERP',
  },
  {
    layout: 'remoteAccess',
    label: 'plant.remoteAccess',
    sub: { type: 'translation', key: 'plant.vpnGateway' },
    icon: 'plant.lock',
  },
  {
    layout: 'industrialDmz',
    label: 'plant.industrialDmz',
    sub: { type: 'translation', key: 'plant.allowlist' },
    icon: 'plant.firewall',
    zone: 'FIREWALL',
  },
  {
    layout: 'scadaCore',
    label: 'plant.scadaCore',
    sub: { type: 'translation', key: 'plant.scadaOnline' },
    icon: 'plant.monitor',
  },
  {
    layout: 'hmiStation',
    label: 'plant.hmiStation',
    sub: { type: 'translation', key: 'plant.hmiOperator' },
    icon: 'plant.monitor',
  },
  {
    layout: 'safetySis',
    label: 'plant.safetySis',
    sub: { type: 'translation', key: 'plant.sisArmed' },
    icon: 'plant.shield',
    zone: 'SIS',
  },
  {
    layout: 'plcController',
    label: 'plant.plcController',
    sub: { type: 'translation', key: 'plant.plcRun' },
    icon: 'plant.chip',
    zone: 'PLC',
  },
]
