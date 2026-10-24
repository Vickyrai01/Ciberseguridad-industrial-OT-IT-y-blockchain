import { describe, expect, it } from 'vitest'
import { applyChoice, finalOutcome, initialState } from './simulationEngine'
import { scenarios } from '../data/scenarios'
import { OPERATIONAL_STATUS, SIMULATION_OUTCOME } from '../../../shared/constants/domain'
describe('simulation engine', () => {
  it('accumulates secure choices into a controlled outcome', () => {
    let state = initialState()
    scenarios.forEach((scenario) => {
      state = applyChoice(
        state,
        scenario,
        scenario.choices.find((choice) => choice.recommended)!,
        scenario.choices.find((choice) => choice.recommended)!.eventKeys,
      )
    })
    expect(state.simulationFinished).toBe(true)
    expect(finalOutcome(state)).toBe(SIMULATION_OUTCOME.CONTROLLED)
    expect(state.compromisedSystems).toBe(0)
  })
  it('does not turn a single wrong answer into game over', () => {
    const state = applyChoice(initialState(), scenarios[0], scenarios[0].choices[2], scenarios[0].choices[2].eventKeys)
    expect(state.operationalStatus).toBe(OPERATIONAL_STATUS.INCIDENT)
    expect(state.security).toBeGreaterThan(0)
    expect(state.simulationFinished).toBe(false)
  })
  it('records the selected option and the resulting state in the event stream', () => {
    const state = applyChoice(initialState(), scenarios[0], scenarios[0].choices[1], scenarios[0].choices[1].eventKeys)
    expect(state.eventLog[3]).toMatchObject({ type: 'decision', scenarioId: 1, option: 'b' })
    expect(state.eventLog[4]).toMatchObject({ type: 'state-update', security: 84, production: 100 })
    expect(state.decisionsHistory).toEqual([{ scenarioId: 1, choiceId: 'b' }])
  })

  it('keeps the real scenario id when the play order is shuffled', () => {
    const shuffledOrder = [5, 1, 3, 2, 4]
    const state = applyChoice(
      initialState(shuffledOrder),
      scenarios[4],
      scenarios[4].choices.find((choice) => choice.recommended)!,
      scenarios[4].choices.find((choice) => choice.recommended)!.eventKeys,
    )

    expect(state.decisionsHistory).toEqual([{ scenarioId: 5, choiceId: 'c' }])
    expect(state.scenarioOrder).toEqual(shuffledOrder)
  })
})
