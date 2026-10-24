import { describe, expect, it } from 'vitest'
import { applyChoice, finalOutcome, initialState } from './simulationEngine'
import { scenarios } from '../data/scenarios'
describe('simulation engine', () => {
  it('accumulates secure choices into a controlled outcome', () => { let state = initialState(); scenarios.forEach((scenario, index) => { state = applyChoice(state, scenario.choices.find((choice) => choice.recommended)!, index) }); expect(state.simulationFinished).toBe(true); expect(finalOutcome(state)).toBe('controlled'); expect(state.compromisedSystems).toBe(0) })
  it('does not turn a single wrong answer into game over', () => { const state = applyChoice(initialState(), scenarios[0].choices[2], 0); expect(state.operationalStatus).toBe('INCIDENTE'); expect(state.security).toBeGreaterThan(0); expect(state.simulationFinished).toBe(false) })
})
