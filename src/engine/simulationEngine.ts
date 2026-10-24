import type { Choice, GameState, OperationalStatus } from '../types'
export const initialState = (): GameState => ({
  currentScenario: 0,
  security: 72,
  production: 100,
  compromisedSystems: 0,
  operationalStatus: 'NORMAL',
  zones: { firewall: 'stable', plc: 'stable', sis: 'stable', erp: 'stable', blockchain: 'stable' },
  eventLog: ['[04:00:00] SYSTEM INITIALIZED', '[04:00:12] PLC-01 STATUS: RUN', '[04:00:18] SCADA TELEMETRY: NOMINAL'],
  selectedAnswers: [],
  decisionsHistory: [],
  simulationFinished: false,
})
const clamp = (n: number) => Math.max(0, Math.min(100, n))
export const applyChoice = (state: GameState, choice: Choice, scenarioIndex: number): GameState => {
  const nextZones = {
    ...state.zones,
    [choice.zone]: choice.status === 'CRÍTICO' ? 'compromised' : choice.recommended ? 'stable' : 'alert',
  } as GameState['zones']
  const nextSecurity = clamp(state.security + choice.security)
  const nextProduction = clamp(state.production + choice.production)
  const nextCompromised = Math.max(0, state.compromisedSystems + choice.compromised)
  const nextStatus: OperationalStatus = nextSecurity < 28 || choice.status === 'CRÍTICO' ? 'CRÍTICO' : choice.status
  const decisionLog = `[04:0${scenarioIndex + 1}:00] DECISION ${String(scenarioIndex + 1).padStart(2, '0')}/05: OPTION ${choice.id.toUpperCase()} SELECTED ${choice.recommended ? '· RECOMMENDED' : '· RISK DETECTED'}`
  const stateLog = `[04:0${scenarioIndex + 1}:01] STATE UPDATE: SECURITY ${nextSecurity}/100 · PRODUCTION ${nextProduction}% · STATUS ${nextStatus}`
  const impactLog = `[04:0${scenarioIndex + 1}:02] IMPACT: ${nextCompromised} SYSTEM${nextCompromised === 1 ? '' : 'S'} COMPROMISED · ZONE ${choice.zone.toUpperCase()}`
  return {
    ...state,
    currentScenario: scenarioIndex + 1,
    security: nextSecurity,
    production: nextProduction,
    compromisedSystems: nextCompromised,
    operationalStatus: nextStatus,
    zones: nextZones,
    eventLog: [
      ...state.eventLog,
      decisionLog,
      stateLog,
      impactLog,
      ...choice.events.map(
        (event, index) => `[04:0${scenarioIndex + 1}:${String(index + 3).padStart(2, '0')}] ${event}`,
      ),
    ],
    selectedAnswers: [...state.selectedAnswers, choice.id],
    decisionsHistory: [...state.decisionsHistory, { scenario: scenarioIndex, choice: choice.id }],
    simulationFinished: scenarioIndex === 4,
  }
}
export const finalOutcome = (state: GameState): 'controlled' | 'contingency' | 'critical' =>
  state.security < 28 || state.operationalStatus === 'CRÍTICO'
    ? 'critical'
    : state.security >= 75 && state.production >= 88 && state.compromisedSystems <= 1
      ? 'controlled'
      : 'contingency'
