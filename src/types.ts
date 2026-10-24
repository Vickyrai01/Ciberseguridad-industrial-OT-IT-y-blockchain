import type { ChoiceId, OperationalStatus, PlantZone, ZoneState } from './constants/domain'

export type { ChoiceId, OperationalStatus, PlantZone, Screen, ZoneState } from './constants/domain'

export interface Choice {
  id: ChoiceId
  labelKey: string
  consequenceKey: string
  recommended: boolean
  security: number
  production: number
  compromised: number
  status: OperationalStatus
  zone: PlantZone
  eventKeys: string[]
}
export interface Scenario {
  id: number
  kickerKey: string
  titleKey: string
  narrativeKey: string
  questionKey: string
  conceptKey: string
  choices: Choice[]
  insightKey: string
  referenceKey?: string
}
export interface GameState {
  currentScenario: number
  security: number
  production: number
  compromisedSystems: number
  operationalStatus: OperationalStatus
  zones: Record<PlantZone, ZoneState>
  eventLog: string[]
  selectedAnswers: ChoiceId[]
  decisionsHistory: { scenario: number; choice: ChoiceId }[]
  simulationFinished: boolean
}
