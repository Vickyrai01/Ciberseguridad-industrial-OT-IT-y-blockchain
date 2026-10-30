import { CHOICE_ID } from '../../../shared/constants/domain'
import type { ChoiceId } from '../../../shared/constants/domain'
import type { TranslationKey } from '../../../i18n/types'

export interface ScenarioContent {
  id: number
  kickerKey: TranslationKey
  titleKey: TranslationKey
  narrativeKey: TranslationKey
  questionKey: TranslationKey
  conceptKey: TranslationKey
  insightKey: TranslationKey
  referenceKey?: TranslationKey
  choices: Record<ChoiceId, { labelKey: TranslationKey; consequenceKey: TranslationKey }>
}

export const scenarioContent: ScenarioContent[] = [
  {
    id: 1,
    kickerKey: 'scenarios.1.kicker',
    titleKey: 'scenarios.1.title',
    narrativeKey: 'scenarios.1.narrative',
    questionKey: 'scenarios.1.question',
    conceptKey: 'scenarios.1.concept',
    insightKey: 'scenarios.1.insight',
    choices: {
      [CHOICE_ID.A]: { labelKey: 'scenarios.1.choices.a.label', consequenceKey: 'scenarios.1.choices.a.consequence' },
      [CHOICE_ID.B]: { labelKey: 'scenarios.1.choices.b.label', consequenceKey: 'scenarios.1.choices.b.consequence' },
      [CHOICE_ID.C]: { labelKey: 'scenarios.1.choices.c.label', consequenceKey: 'scenarios.1.choices.c.consequence' },
    },
  },
  {
    id: 2,
    kickerKey: 'scenarios.2.kicker',
    titleKey: 'scenarios.2.title',
    narrativeKey: 'scenarios.2.narrative',
    questionKey: 'scenarios.2.question',
    conceptKey: 'scenarios.2.concept',
    insightKey: 'scenarios.2.insight',
    choices: {
      [CHOICE_ID.A]: { labelKey: 'scenarios.2.choices.a.label', consequenceKey: 'scenarios.2.choices.a.consequence' },
      [CHOICE_ID.B]: { labelKey: 'scenarios.2.choices.b.label', consequenceKey: 'scenarios.2.choices.b.consequence' },
      [CHOICE_ID.C]: { labelKey: 'scenarios.2.choices.c.label', consequenceKey: 'scenarios.2.choices.c.consequence' },
    },
  },
  {
    id: 3,
    kickerKey: 'scenarios.3.kicker',
    titleKey: 'scenarios.3.title',
    narrativeKey: 'scenarios.3.narrative',
    questionKey: 'scenarios.3.question',
    conceptKey: 'scenarios.3.concept',
    insightKey: 'scenarios.3.insight',
    choices: {
      [CHOICE_ID.A]: { labelKey: 'scenarios.3.choices.a.label', consequenceKey: 'scenarios.3.choices.a.consequence' },
      [CHOICE_ID.B]: { labelKey: 'scenarios.3.choices.b.label', consequenceKey: 'scenarios.3.choices.b.consequence' },
      [CHOICE_ID.C]: { labelKey: 'scenarios.3.choices.c.label', consequenceKey: 'scenarios.3.choices.c.consequence' },
    },
  },
  {
    id: 4,
    kickerKey: 'scenarios.4.kicker',
    titleKey: 'scenarios.4.title',
    narrativeKey: 'scenarios.4.narrative',
    questionKey: 'scenarios.4.question',
    conceptKey: 'scenarios.4.concept',
    insightKey: 'scenarios.4.insight',
    referenceKey: 'scenarios.4.reference',
    choices: {
      [CHOICE_ID.A]: { labelKey: 'scenarios.4.choices.a.label', consequenceKey: 'scenarios.4.choices.a.consequence' },
      [CHOICE_ID.B]: { labelKey: 'scenarios.4.choices.b.label', consequenceKey: 'scenarios.4.choices.b.consequence' },
      [CHOICE_ID.C]: { labelKey: 'scenarios.4.choices.c.label', consequenceKey: 'scenarios.4.choices.c.consequence' },
    },
  },
  {
    id: 5,
    kickerKey: 'scenarios.5.kicker',
    titleKey: 'scenarios.5.title',
    narrativeKey: 'scenarios.5.narrative',
    questionKey: 'scenarios.5.question',
    conceptKey: 'scenarios.5.concept',
    insightKey: 'scenarios.5.insight',
    choices: {
      [CHOICE_ID.A]: { labelKey: 'scenarios.5.choices.a.label', consequenceKey: 'scenarios.5.choices.a.consequence' },
      [CHOICE_ID.B]: { labelKey: 'scenarios.5.choices.b.label', consequenceKey: 'scenarios.5.choices.b.consequence' },
      [CHOICE_ID.C]: { labelKey: 'scenarios.5.choices.c.label', consequenceKey: 'scenarios.5.choices.c.consequence' },
    },
  },
]
