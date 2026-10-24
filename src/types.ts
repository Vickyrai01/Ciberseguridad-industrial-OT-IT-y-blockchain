export type Screen = 'welcome' | 'simulation' | 'results'
export type OperationalStatus = 'normal' | 'warning' | 'incident' | 'contingency' | 'critical' | 'recovery'
export type ZoneState = 'stable' | 'alert' | 'compromised' | 'isolated'

export interface Choice {
  id: string
  labelKey: string
  consequenceKey: string
  recommended: boolean
  security: number
  production: number
  compromised: number
  status: OperationalStatus
  zone: string
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
  zones: Record<string, ZoneState>
  eventLog: string[]
  selectedAnswers: string[]
  decisionsHistory: { scenario: number; choice: string }[]
  simulationFinished: boolean
}
