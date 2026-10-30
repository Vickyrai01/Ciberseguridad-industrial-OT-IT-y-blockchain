import { CHOICE_ID } from '../../../shared/constants/domain'
import type { Choice, Scenario } from '../../../types'
import { scenarioContent } from './scenarioContent'
import { scenarioRules } from './scenarioRules'

const choiceIds = [CHOICE_ID.A, CHOICE_ID.B, CHOICE_ID.C] as const

export const scenarios: Scenario[] = scenarioContent.map((content) => ({
  ...content,
  choices: choiceIds.map((choiceId): Choice => ({
    id: choiceId,
    ...content.choices[choiceId],
    ...scenarioRules[content.id][choiceId],
  })),
}))
