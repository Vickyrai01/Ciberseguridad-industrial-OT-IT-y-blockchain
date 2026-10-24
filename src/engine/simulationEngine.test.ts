import { describe, expect, it } from 'vitest'
import { applyChoice, finalOutcome, initialState } from './simulationEngine'
import { scenarios } from '../data/scenarios'
describe('simulation engine', () => {
  it('accumulates secure choices into a controlled outcome', () => {
    let state = initialState()
    scenarios.forEach((scenario, index) => {
      state = applyChoice(
        state,
        scenario.choices.find((choice) => choice.recommended)!,
        index,
        scenario.choices.find((choice) => choice.recommended)!.eventKeys,
      )
    })
    expect(state.simulationFinished).toBe(true)
    expect(finalOutcome(state)).toBe('controlled')
    expect(state.compromisedSystems).toBe(0)
  })
  it('does not turn a single wrong answer into game over', () => {
    const state = applyChoice(initialState(), scenarios[0].choices[2], 0, scenarios[0].choices[2].eventKeys)
    expect(state.operationalStatus).toBe('incident')
    expect(state.security).toBeGreaterThan(0)
    expect(state.simulationFinished).toBe(false)
  })
  it('records the selected option and the resulting state in the event stream', () => {
    const state = applyChoice(initialState(), scenarios[0].choices[1], 0, scenarios[0].choices[1].eventKeys)
    expect(state.eventLog.some((event) => event.includes('DECISION 01/05: OPTION B SELECTED'))).toBe(true)
    expect(state.eventLog.some((event) => event.includes('STATE UPDATE: SECURITY 84/100'))).toBe(true)
  })
})
