import { EVENT_TONE, EVENT_TYPE, SIMULATION_CONFIG, type EventTone } from '../constants/domain'
import type { EventLogEntry } from '../../types'

export type Translator = (key: string) => string

export interface FormattedEvent {
  id: string
  message: string
  tone: EventTone
}

export function formatEvent(event: EventLogEntry, translate: Translator): FormattedEvent {
  const prefix = event.timestamp

  switch (event.type) {
    case EVENT_TYPE.SYSTEM:
    case EVENT_TYPE.MESSAGE:
      return {
        id: event.id,
        tone: event.tone,
        message: `${prefix} ${translate(event.messageKey ?? '')}`,
      }
    case EVENT_TYPE.DECISION:
      return {
        id: event.id,
        tone: event.tone,
        message: `${prefix} ${translate('log.decision')} ${String(event.scenarioId).padStart(2, '0')}/${String(SIMULATION_CONFIG.scenarioCount).padStart(2, '0')}: ${translate('log.option')} ${event.option?.toUpperCase()} ${translate('log.selected')} · ${event.recommended ? translate('log.recommended') : translate('log.riskDetected')}`,
      }
    case EVENT_TYPE.STATE_UPDATE:
      return {
        id: event.id,
        tone: event.tone,
        message: `${prefix} ${translate('log.stateUpdate')}: ${translate('log.security')} ${event.security}/100 · ${translate('log.production')} ${event.production}% · ${translate('log.status')} ${translate(`status.${event.status}`)}`,
      }
    case EVENT_TYPE.IMPACT:
      return {
        id: event.id,
        tone: event.tone,
        message: `${prefix} ${translate('log.impact')}: ${event.compromisedSystems} ${event.compromisedSystems === 1 ? translate('log.system') : translate('log.systems')} ${translate('log.compromised')} · ${translate('log.zone')} ${event.zone?.toUpperCase()}`,
      }
  }
}

export function eventToneClass(tone: EventTone): string {
  return tone === EVENT_TONE.DEFAULT ? '' : tone
}
