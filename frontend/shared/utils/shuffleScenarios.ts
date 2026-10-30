import type { Scenario } from '../../types'

export function shuffleScenarios(scenarios: Scenario[]): Scenario[] {
  const shuffled = scenarios.map((scenario) => ({ ...scenario, choices: [...scenario.choices] }))

  shuffled.forEach((scenario, scenarioIndex) => {
    let recommendedPosition = -1
    let attempts = 0
    do {
      for (let index = scenario.choices.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1))
        ;[scenario.choices[index], scenario.choices[swapIndex]] = [scenario.choices[swapIndex], scenario.choices[index]]
      }
      recommendedPosition = scenario.choices.findIndex((choice) => choice.recommended)
      attempts += 1
    } while (
      scenarioIndex > 0 &&
      recommendedPosition === shuffled[scenarioIndex - 1].choices.findIndex((choice) => choice.recommended) &&
      attempts < 10
    )
  })

  return shuffled
}
