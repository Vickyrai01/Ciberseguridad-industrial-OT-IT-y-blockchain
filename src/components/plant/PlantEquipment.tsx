import { useTranslation } from 'react-i18next'
import { PLANT_ZONE, ZONE_STATE } from '../../constants/domain'
import type { ZoneState } from '../../types'
import { PlantNode } from './PlantNode'

interface PlantEquipmentProps {
  zone: (name: keyof typeof PLANT_ZONE) => ZoneState
}

export function PlantEquipment({ zone }: PlantEquipmentProps) {
  const { t } = useTranslation()

  return (
    <>
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
    </>
  )
}
