import { describe, expect, it } from 'vitest'
import { countCorrectDecisions, getRankKey, getResultCopyKeys } from './results'
import { OPERATIONAL_STATUS, PLANT_ZONE, SIMULATION_OUTCOME, ZONE_STATE } from '../constants/domain'
import type { GameState } from '../types'

const createState = (decisionsHistory: GameState['decisionsHistory']): GameState => ({
  currentScenario: 0,
  security: 100,
  production: 100,
  compromisedSystems: 0,
  operationalStatus: OPERATIONAL_STATUS.NORMAL,
  zones: {
    [PLANT_ZONE.FIREWALL]: ZONE_STATE.STABLE,
    [PLANT_ZONE.PLC]: ZONE_STATE.STABLE,
    [PLANT_ZONE.SIS]: ZONE_STATE.STABLE,
    [PLANT_ZONE.ERP]: ZONE_STATE.STABLE,
    [PLANT_ZONE.BLOCKCHAIN]: ZONE_STATE.STABLE,
  },
  eventLog: [],
  scenarioOrder: [1, 2, 3],
  decisionsHistory,
  simulationFinished: true,
})

describe('results utilities', () => {
  it('counts correct decisions by scenario id instead of array position', () => {
    const state = createState([
      { scenarioId: 2, choiceId: 'b' },
      { scenarioId: 1, choiceId: 'b' },
      { scenarioId: 3, choiceId: 'a' },
    ])

    expect(countCorrectDecisions(state)).toBe(2)
  })

  it('returns the expected rank key for the number of correct decisions', () => {
    expect(getRankKey(5)).toBe('common.resilienceArchitect')
    expect(getRankKey(3)).toBe('common.industrialSpecialist')
    expect(getRankKey(1)).toBe('common.juniorAnalyst')
    expect(getRankKey(0)).toBe('common.insiderThreat')
  })

  it('maps each simulation outcome to its translated copy keys', () => {
    expect(getResultCopyKeys(SIMULATION_OUTCOME.CONTROLLED)).toEqual({
      titleKey: 'common.controlledTitle',
      subtitleKey: 'common.controlledSubtitle',
    })
  })
})
