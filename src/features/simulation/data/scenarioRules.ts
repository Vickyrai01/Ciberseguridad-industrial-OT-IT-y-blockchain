import { CHOICE_ID, OPERATIONAL_STATUS, PLANT_ZONE } from '../../../shared/constants/domain'
import type { ChoiceId, OperationalStatus, PlantZone } from '../../../types'
import type { TranslationKey } from '../../../i18n/types'

export interface ChoiceRule {
  recommended: boolean
  security: number
  production: number
  compromised: number
  status: OperationalStatus
  zone: PlantZone
  eventKeys: TranslationKey[]
}

export type ScenarioRules = Record<number, Record<ChoiceId, ChoiceRule>>

export const scenarioRules: ScenarioRules = {
  1: {
    [CHOICE_ID.A]: {
      recommended: false,
      security: -15,
      production: 0,
      compromised: 1,
      status: OPERATIONAL_STATUS.WARNING,
      zone: PLANT_ZONE.FIREWALL,
      eventKeys: ['events.itOtUnrestricted', 'events.attackSurfaceElevated'],
    },
    [CHOICE_ID.B]: {
      recommended: true,
      security: 12,
      production: 0,
      compromised: 0,
      status: OPERATIONAL_STATUS.NORMAL,
      zone: PLANT_ZONE.FIREWALL,
      eventKeys: ['events.firewallUpdated', 'events.dmzConduitActive'],
    },
    [CHOICE_ID.C]: {
      recommended: false,
      security: -28,
      production: -8,
      compromised: 2,
      status: OPERATIONAL_STATUS.INCIDENT,
      zone: PLANT_ZONE.PLC,
      eventKeys: ['events.plcExposed', 'events.untrustedWritePath'],
    },
  },
  2: {
    [CHOICE_ID.A]: {
      recommended: false,
      security: -12,
      production: -4,
      compromised: 1,
      status: OPERATIONAL_STATUS.INCIDENT,
      zone: PLANT_ZONE.PLC,
      eventKeys: ['events.authAssumption', 'events.plcWriteUnblocked'],
    },
    [CHOICE_ID.B]: {
      recommended: true,
      security: 10,
      production: 0,
      compromised: 0,
      status: OPERATIONAL_STATUS.WARNING,
      zone: PLANT_ZONE.PLC,
      eventKeys: ['events.modbusRiskIdentified', 'events.compensatingControls'],
    },
    [CHOICE_ID.C]: {
      recommended: false,
      security: -10,
      production: -3,
      compromised: 1,
      status: OPERATIONAL_STATUS.INCIDENT,
      zone: PLANT_ZONE.PLC,
      eventKeys: ['events.blockchainOutOfPath', 'events.legacyProtocolUnprotected'],
    },
  },
  3: {
    [CHOICE_ID.A]: {
      recommended: false,
      security: -8,
      production: -4,
      compromised: 1,
      status: OPERATIONAL_STATUS.INCIDENT,
      zone: PLANT_ZONE.SIS,
      eventKeys: ['events.sisMisclassification', 'events.verificationDelayed'],
    },
    [CHOICE_ID.B]: {
      recommended: true,
      security: 14,
      production: -5,
      compromised: 0,
      status: OPERATIONAL_STATUS.CONTINGENCY,
      zone: PLANT_ZONE.SIS,
      eventKeys: ['events.sisIsolation', 'events.safetyLogicVerification'],
    },
    [CHOICE_ID.C]: {
      recommended: false,
      security: -6,
      production: -6,
      compromised: 1,
      status: OPERATIONAL_STATUS.INCIDENT,
      zone: PLANT_ZONE.SIS,
      eventKeys: ['events.sisResponseMisdirected', 'events.processSafetyUnverified'],
    },
  },
  4: {
    [CHOICE_ID.A]: {
      recommended: false,
      security: -10,
      production: 5,
      compromised: 1,
      status: OPERATIONAL_STATUS.INCIDENT,
      zone: PLANT_ZONE.ERP,
      eventKeys: ['events.paymentRejected', 'events.recoveryNotVerified'],
    },
    [CHOICE_ID.B]: {
      recommended: true,
      security: 12,
      production: 12,
      compromised: -1,
      status: OPERATIONAL_STATUS.RECOVERY,
      zone: PLANT_ZONE.ERP,
      eventKeys: ['events.erpIsolated', 'events.backupVerified', 'events.contingencyStable'],
    },
    [CHOICE_ID.C]: {
      recommended: false,
      security: -16,
      production: -12,
      compromised: 2,
      status: OPERATIONAL_STATUS.CRITICAL,
      zone: PLANT_ZONE.ERP,
      eventKeys: ['events.rebootLoop', 'events.ransomwareLateralMovement'],
    },
  },
  5: {
    [CHOICE_ID.A]: {
      recommended: false,
      security: -8,
      production: 0,
      compromised: 1,
      status: OPERATIONAL_STATUS.INCIDENT,
      zone: PLANT_ZONE.BLOCKCHAIN,
      eventKeys: ['events.oracleSourceUnverified', 'events.chainFalseInput'],
    },
    [CHOICE_ID.B]: {
      recommended: false,
      security: -6,
      production: 0,
      compromised: 1,
      status: OPERATIONAL_STATUS.WARNING,
      zone: PLANT_ZONE.BLOCKCHAIN,
      eventKeys: ['events.noPhysicalTruthSensor', 'events.oracleAssumption'],
    },
    [CHOICE_ID.C]: {
      recommended: true,
      security: 10,
      production: 2,
      compromised: 0,
      status: OPERATIONAL_STATUS.RECOVERY,
      zone: PLANT_ZONE.BLOCKCHAIN,
      eventKeys: ['events.blockHashValid', 'events.dataOriginUntrusted', 'events.oracleLimitation'],
    },
  },
}
