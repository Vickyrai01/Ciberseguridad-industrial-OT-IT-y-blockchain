import type { ChoiceId, EventType, EventTone, OperationalStatus, PlantZone, ZoneState } from './shared/constants/domain'
import type { TranslationKey } from './i18n/types'

export type {
  ChoiceId,
  EventType,
  EventTone,
  OperationalStatus,
  PlantZone,
  Screen,
  ZoneState,
} from './shared/constants/domain'

export interface Choice {
  id: ChoiceId
  labelKey: TranslationKey
  consequenceKey: TranslationKey
  recommended: boolean
  security: number
  production: number
  compromised: number
  status: OperationalStatus
  zone: PlantZone
  eventKeys: TranslationKey[]
}
export interface Scenario {
  id: number
  kickerKey: TranslationKey
  titleKey: TranslationKey
  narrativeKey: TranslationKey
  questionKey: TranslationKey
  conceptKey: TranslationKey
  choices: Choice[]
  insightKey: TranslationKey
  referenceKey?: TranslationKey
}

export interface DecisionRecord {
  scenarioId: number
  choiceId: ChoiceId
}

interface EventBase<Type extends EventType, Tone extends EventTone> {
  id: string
  timestamp: string
  type: Type
  tone: Tone
}

export type EventLogEntry =
  | (EventBase<'system', 'default'> & { messageKey: TranslationKey })
  | (EventBase<'message', 'default'> & { messageKey: TranslationKey })
  | (EventBase<'decision', 'decision'> & {
      scenarioId: number
      option: ChoiceId
      recommended: boolean
    })
  | (EventBase<'state-update', 'state-update'> & {
      security: number
      production: number
      status: OperationalStatus
    })
  | (EventBase<'impact', 'impact'> & {
      compromisedSystems: number
      zone: PlantZone
    })

export interface GameState {
  currentScenario: number
  security: number
  production: number
  compromisedSystems: number
  operationalStatus: OperationalStatus
  zones: Record<PlantZone, ZoneState>
  scenarioOrder: number[]
  eventLog: EventLogEntry[]
  decisionsHistory: DecisionRecord[]
  simulationFinished: boolean
}
