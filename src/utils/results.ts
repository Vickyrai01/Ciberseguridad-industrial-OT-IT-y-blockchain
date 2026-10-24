import { scenarios } from '../data/scenarios'
import { SIMULATION_CONFIG, SIMULATION_OUTCOME, type SimulationOutcome } from '../constants/domain'
import type { GameState } from '../types'

interface ResultCopyKeys {
  titleKey: string
  subtitleKey: string
}

export function countCorrectDecisions(state: GameState): number {
  return state.decisionsHistory.reduce((correct, decision) => {
    const scenario = scenarios.find(({ id }) => id === decision.scenario)
    const selectedChoice = scenario?.choices.find(({ id }) => id === decision.choice)
    return correct + (selectedChoice?.recommended ? 1 : 0)
  }, 0)
}

export function getResultCopyKeys(outcome: SimulationOutcome): ResultCopyKeys {
  const copyByOutcome: Record<SimulationOutcome, ResultCopyKeys> = {
    [SIMULATION_OUTCOME.CONTROLLED]: {
      titleKey: 'common.controlledTitle',
      subtitleKey: 'common.controlledSubtitle',
    },
    [SIMULATION_OUTCOME.CONTINGENCY]: {
      titleKey: 'common.contingencyTitle',
      subtitleKey: 'common.contingencySubtitle',
    },
    [SIMULATION_OUTCOME.CRITICAL]: {
      titleKey: 'common.criticalTitle',
      subtitleKey: 'common.criticalSubtitle',
    },
  }

  return copyByOutcome[outcome]
}

export function getRankKey(correctDecisions: number): string {
  if (correctDecisions === SIMULATION_CONFIG.scenarioCount) {
    return 'common.resilienceArchitect'
  }

  if (correctDecisions >= SIMULATION_CONFIG.specialistCorrectThreshold) {
    return 'common.industrialSpecialist'
  }

  if (correctDecisions >= SIMULATION_CONFIG.juniorCorrectThreshold) {
    return 'common.juniorAnalyst'
  }

  return 'common.insiderThreat'
}
