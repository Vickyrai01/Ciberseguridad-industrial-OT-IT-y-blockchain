export const SCREEN = {
  WELCOME: 'welcome',
  SIMULATION: 'simulation',
  RESULTS: 'results',
} as const

export type Screen = (typeof SCREEN)[keyof typeof SCREEN]

export const OPERATIONAL_STATUS = {
  NORMAL: 'normal',
  WARNING: 'warning',
  INCIDENT: 'incident',
  CONTINGENCY: 'contingency',
  CRITICAL: 'critical',
  RECOVERY: 'recovery',
} as const

export type OperationalStatus = (typeof OPERATIONAL_STATUS)[keyof typeof OPERATIONAL_STATUS]

export const ZONE_STATE = {
  STABLE: 'stable',
  ALERT: 'alert',
  COMPROMISED: 'compromised',
  ISOLATED: 'isolated',
} as const

export type ZoneState = (typeof ZONE_STATE)[keyof typeof ZONE_STATE]

export const PLANT_ZONE = {
  FIREWALL: 'firewall',
  PLC: 'plc',
  SIS: 'sis',
  ERP: 'erp',
  BLOCKCHAIN: 'blockchain',
} as const

export type PlantZone = (typeof PLANT_ZONE)[keyof typeof PLANT_ZONE]

export const CHOICE_ID = {
  A: 'a',
  B: 'b',
  C: 'c',
} as const

export type ChoiceId = (typeof CHOICE_ID)[keyof typeof CHOICE_ID]

export const SIMULATION_OUTCOME = {
  CONTROLLED: 'controlled',
  CONTINGENCY: 'contingency',
  CRITICAL: 'critical',
} as const

export type SimulationOutcome = (typeof SIMULATION_OUTCOME)[keyof typeof SIMULATION_OUTCOME]

export const EVENT_TONE = {
  DEFAULT: 'default',
  DECISION: 'decision',
  STATE_UPDATE: 'state-update',
  IMPACT: 'impact',
} as const

export type EventTone = (typeof EVENT_TONE)[keyof typeof EVENT_TONE]

export const SOUND_EFFECT = {
  CLICK: 'click',
  ALERT: 'alert',
  SUCCESS: 'success',
} as const

export type SoundEffect = (typeof SOUND_EFFECT)[keyof typeof SOUND_EFFECT]

export const SIMULATION_CONFIG = {
  scenarioCount: 5,
  lastScenarioIndex: 4,
  initialSecurity: 72,
  initialProduction: 100,
  criticalSecurityThreshold: 28,
  controlledSecurityThreshold: 75,
  controlledProductionThreshold: 88,
  controlledCompromisedThreshold: 1,
  specialistCorrectThreshold: 3,
  juniorCorrectThreshold: 1,
  maxMetric: 100,
  minMetric: 0,
} as const
