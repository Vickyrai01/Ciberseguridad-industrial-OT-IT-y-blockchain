export type Screen = 'welcome' | 'simulation' | 'results'
export type OperationalStatus = 'NORMAL' | 'ADVERTENCIA' | 'INCIDENTE' | 'CONTINGENCIA' | 'CRÍTICO' | 'RECUPERACIÓN'
export type ZoneState = 'stable' | 'alert' | 'compromised' | 'isolated'

export interface Choice { id: string; label: string; consequence: string; recommended: boolean; security: number; production: number; compromised: number; status: OperationalStatus; zone: string; events: string[] }
export interface Scenario { id: number; kicker: string; title: string; narrative: string; question: string; concept: string; choices: Choice[]; insight: string; reference?: string }
export interface GameState { currentScenario: number; security: number; production: number; compromisedSystems: number; operationalStatus: OperationalStatus; zones: Record<string, ZoneState>; eventLog: string[]; selectedAnswers: string[]; decisionsHistory: { scenario: number; choice: string }[]; simulationFinished: boolean }
