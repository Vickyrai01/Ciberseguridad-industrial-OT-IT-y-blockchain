import type { Choice, EventLogEntry, GameState, OperationalStatus, Scenario } from '../../../types'
import type { TranslationKey } from '../../../i18n/types'
import {
  EVENT_TONE,
  EVENT_TYPE,
  OPERATIONAL_STATUS,
  PLANT_ZONE,
  SIMULATION_CONFIG,
  SIMULATION_OUTCOME,
  ZONE_STATE,
  type SimulationOutcome,
} from '../../../shared/constants/domain'
const createEvent = <T extends EventLogEntry>(event: T): T => event

export const initialState = (scenarioOrder: number[] = []): GameState => ({
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
  scenarioOrder,
  eventLog: [
    createEvent({
      id: 'system-initialized',
      timestamp: '[04:00:00]',
      type: EVENT_TYPE.SYSTEM,
      tone: EVENT_TONE.DEFAULT,
      messageKey: 'log.systemInitialized',
    }),
    createEvent({
      id: 'plc-status',
      timestamp: '[04:00:12]',
      type: EVENT_TYPE.SYSTEM,
      tone: EVENT_TONE.DEFAULT,
      messageKey: 'log.plcRun',
    }),
    createEvent({
      id: 'scada-telemetry',
      timestamp: '[04:00:18]',
      type: EVENT_TYPE.SYSTEM,
      tone: EVENT_TONE.DEFAULT,
      messageKey: 'log.scadaNominal',
    }),
  ],
  decisionsHistory: [],
  simulationFinished: false,
})
const clamp = (n: number) => Math.max(SIMULATION_CONFIG.minMetric, Math.min(SIMULATION_CONFIG.maxMetric, n))

const timestampFor = (scenarioIndex: number, seconds: number) =>
  `[04:0${scenarioIndex + 1}:${String(seconds).padStart(2, '0')}]`

export const applyChoice = (
  state: GameState,
  scenario: Scenario,
  choice: Choice,
  eventKeys: TranslationKey[],
): GameState => {
  const scenarioIndex = state.currentScenario
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
  const decisionLog = createEvent({
    id: `scenario-${scenario.id}-decision`,
    timestamp: timestampFor(scenarioIndex, 0),
    type: EVENT_TYPE.DECISION,
    tone: EVENT_TONE.DECISION,
    scenarioId: scenario.id,
    option: choice.id,
    recommended: choice.recommended,
  })
  const stateLog = createEvent({
    id: `scenario-${scenario.id}-state`,
    timestamp: timestampFor(scenarioIndex, 1),
    type: EVENT_TYPE.STATE_UPDATE,
    tone: EVENT_TONE.STATE_UPDATE,
    security: nextSecurity,
    production: nextProduction,
    status: nextStatus,
  })
  const impactLog = createEvent({
    id: `scenario-${scenario.id}-impact`,
    timestamp: timestampFor(scenarioIndex, 2),
    type: EVENT_TYPE.IMPACT,
    tone: EVENT_TONE.IMPACT,
    compromisedSystems: nextCompromised,
    zone: choice.zone,
  })
  const messageLogs = eventKeys.map((messageKey, index) =>
    createEvent({
      id: `scenario-${scenario.id}-message-${index}`,
      timestamp: timestampFor(scenarioIndex, index + 3),
      type: EVENT_TYPE.MESSAGE,
      tone: EVENT_TONE.DEFAULT,
      messageKey,
    }),
  )
  return {
    ...state,
    currentScenario: scenarioIndex + 1,
    security: nextSecurity,
    production: nextProduction,
    compromisedSystems: nextCompromised,
    operationalStatus: nextStatus,
    zones: nextZones,
    eventLog: [...state.eventLog, decisionLog, stateLog, impactLog, ...messageLogs],
    decisionsHistory: [...state.decisionsHistory, { scenarioId: scenario.id, choiceId: choice.id }],
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
