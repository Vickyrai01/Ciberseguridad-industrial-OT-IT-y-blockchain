export type EventTone = 'default' | 'decision' | 'state-update' | 'impact'
export type Translator = (key: string) => string

export interface FormattedEvent {
  message: string
  tone: EventTone
}

const decisionPattern = /^(\[[^\]]+\]) DECISION (\d+\/05): OPTION ([ABC]) SELECTED · (RECOMMENDED|RISK DETECTED)$/
const stateUpdatePattern = /^(\[[^\]]+\]) STATE UPDATE: SECURITY (\d+)\/100 · PRODUCTION (\d+)% · STATUS ([A-Z]+)$/
const impactPattern = /^(\[[^\]]+\]) IMPACT: (\d+) SYSTEM(S)? COMPROMISED · ZONE ([A-Z]+)$/

export function formatEvent(event: string, translate: Translator): FormattedEvent {
  const decision = event.match(decisionPattern)
  if (decision) {
    return {
      tone: 'decision',
      message: `${decision[1]} ${translate('log.decision')} ${decision[2]}: ${translate('log.option')} ${decision[3]} ${translate('log.selected')} · ${decision[4] === 'RECOMMENDED' ? translate('log.recommended') : translate('log.riskDetected')}`,
    }
  }

  const stateUpdate = event.match(stateUpdatePattern)
  if (stateUpdate) {
    return {
      tone: 'state-update',
      message: `${stateUpdate[1]} ${translate('log.stateUpdate')}: ${translate('log.security')} ${stateUpdate[2]}/100 · ${translate('log.production')} ${stateUpdate[3]}% · ${translate('log.status')} ${translate(`status.${stateUpdate[4].toLowerCase()}`)}`,
    }
  }

  const impact = event.match(impactPattern)
  if (impact) {
    return {
      tone: 'impact',
      message: `${impact[1]} ${translate('log.impact')}: ${impact[2]} ${impact[3] === '1' ? translate('log.system') : translate('log.systems')} ${translate('log.compromised')} · ${translate('log.zone')} ${impact[5]}`,
    }
  }

  return {
    tone: 'default',
    message: event
      .replace('SYSTEM INITIALIZED', translate('log.systemInitialized'))
      .replace('PLC-01 STATUS: RUN', translate('log.plcRun'))
      .replace('SCADA TELEMETRY: NOMINAL', translate('log.scadaNominal')),
  }
}

export function eventToneClass(tone: EventTone): string {
  return tone === 'default' ? '' : tone
}
