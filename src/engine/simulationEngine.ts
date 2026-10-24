import type { Choice, GameState, OperationalStatus } from '../types'
import {
  OPERATIONAL_STATUS,
  PLANT_ZONE,
  SIMULATION_CONFIG,
  SIMULATION_OUTCOME,
  ZONE_STATE,
  type SimulationOutcome,
} from '../constants/domain'
export const initialState = (): GameState => ({
  currentScenario: 0,
  security: SIMULATION_CONFIG.initialSecurity,
  production: SIMULATION_CONFIG.initialProduction,
  compromisedSystems: 0,
  operationalStatus: OPERATIONAL_STATUS.NORMAL,
  zones: {
    [PLANT_ZONE.FIREWALL]: ZONE_STATE.STABLE,
    [PLANT_ZONE.PLC]: ZONE_STATE.STABLE,
    [PLANT_ZONE.SIS]: ZONE_STATE.STABLE,
    [PLANT_ZONE.ERP]: ZONE_STATE.STABLE,
    [PLANT_ZONE.BLOCKCHAIN]: ZONE_STATE.STABLE,
  },
  eventLog: ['[04:00:00] SYSTEM INITIALIZED', '[04:00:12] PLC-01 STATUS: RUN', '[04:00:18] SCADA TELEMETRY: NOMINAL'],
  selectedAnswers: [],
  decisionsHistory: [],
  simulationFinished: false,
})
const clamp = (n: number) => Math.max(SIMULATION_CONFIG.minMetric, Math.min(SIMULATION_CONFIG.maxMetric, n))
export const applyChoice = (
  state: GameState,
  choice: Choice,
  scenarioIndex: number,
  eventMessages: string[],
): GameState => {
  const nextZones = {
    ...state.zones,
    [choice.zone]:
      choice.status === OPERATIONAL_STATUS.CRITICAL
        ? ZONE_STATE.COMPROMISED
        : choice.recommended
          ? ZONE_STATE.STABLE
          : ZONE_STATE.ALERT,
  }
  const nextSecurity = clamp(state.security + choice.security)
  const nextProduction = clamp(state.production + choice.production)
  const nextCompromised = Math.max(0, state.compromisedSystems + choice.compromised)
  const nextStatus: OperationalStatus =
    nextSecurity < SIMULATION_CONFIG.criticalSecurityThreshold || choice.status === OPERATIONAL_STATUS.CRITICAL
      ? OPERATIONAL_STATUS.CRITICAL
      : choice.status
  const decisionLog = `[04:0${scenarioIndex + 1}:00] DECISION ${String(scenarioIndex + 1).padStart(2, '0')}/05: OPTION ${choice.id.toUpperCase()} SELECTED ${choice.recommended ? '· RECOMMENDED' : '· RISK DETECTED'}`
  const stateLog = `[04:0${scenarioIndex + 1}:01] STATE UPDATE: SECURITY ${nextSecurity}/100 · PRODUCTION ${nextProduction}% · STATUS ${nextStatus.toUpperCase()}`
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
      ...eventMessages.map(
        (event, index) => `[04:0${scenarioIndex + 1}:${String(index + 3).padStart(2, '0')}] ${event}`,
      ),
    ],
    selectedAnswers: [...state.selectedAnswers, choice.id],
    decisionsHistory: [...state.decisionsHistory, { scenario: scenarioIndex, choice: choice.id }],
    simulationFinished: scenarioIndex === SIMULATION_CONFIG.lastScenarioIndex,
  }
}
export const finalOutcome = (state: GameState): SimulationOutcome =>
  state.security < SIMULATION_CONFIG.criticalSecurityThreshold ||
  state.operationalStatus === OPERATIONAL_STATUS.CRITICAL
    ? SIMULATION_OUTCOME.CRITICAL
    : state.security >= SIMULATION_CONFIG.controlledSecurityThreshold &&
        state.production >= SIMULATION_CONFIG.controlledProductionThreshold &&
        state.compromisedSystems <= SIMULATION_CONFIG.controlledCompromisedThreshold
      ? SIMULATION_OUTCOME.CONTROLLED
      : SIMULATION_OUTCOME.CONTINGENCY
