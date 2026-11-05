export const SCENARIO_ANSWER_KEY = {
  1: 'b',
  2: 'b',
  3: 'b',
  4: 'b',
  5: 'c',
} as const

export type ScenarioId = keyof typeof SCENARIO_ANSWER_KEY
export type QuizChoiceId = (typeof SCENARIO_ANSWER_KEY)[ScenarioId] | 'a' | 'b' | 'c'

export function isCorrectChoice(scenarioId: number, choiceId: string): boolean {
  return SCENARIO_ANSWER_KEY[scenarioId as ScenarioId] === choiceId
}
