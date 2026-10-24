import { describe, expect, it } from 'vitest'
import { countCorrectDecisions, getRankKey, getResultCopyKeys } from './results'
import { SIMULATION_OUTCOME } from '../constants/domain'
import type { GameState } from '../types'

const createState = (decisionsHistory: GameState['decisionsHistory']): GameState => ({
  currentScenario: 0,
  security: 100,
  production: 100,
  compromisedSystems: 0,
  operationalStatus: 'normal',
  zones: {
    firewall: 'stable',
    plc: 'stable',
    sis: 'stable',
    erp: 'stable',
    blockchain: 'stable',
  },
  eventLog: [],
  selectedAnswers: [],
  decisionsHistory,
  simulationFinished: true,
})

describe('results utilities', () => {
  it('counts correct decisions by scenario id instead of array position', () => {
    const state = createState([
      { scenario: 2, choice: 'b' },
      { scenario: 1, choice: 'b' },
      { scenario: 3, choice: 'a' },
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
