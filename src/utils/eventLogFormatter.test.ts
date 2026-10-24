import { describe, expect, it } from 'vitest'
import { eventToneClass, formatEvent } from './eventLogFormatter'
import { EVENT_TONE } from '../constants/domain'

const translate = (key: string) => key

describe('event log formatter', () => {
  it('classifies and translates decision events', () => {
    const event = formatEvent('[04:01:00] DECISION 01/05: OPTION B SELECTED · RECOMMENDED', translate)
    expect(event.tone).toBe(EVENT_TONE.DECISION)
    expect(event.message).toContain('log.decision')
  })

  it('classifies state and impact events', () => {
    expect(
      eventToneClass(
        formatEvent('[04:01:01] STATE UPDATE: SECURITY 84/100 · PRODUCTION 100% · STATUS NORMAL', translate).tone,
      ),
    ).toBe(EVENT_TONE.STATE_UPDATE)
    expect(eventToneClass(formatEvent('[04:01:02] IMPACT: 1 SYSTEM COMPROMISED · ZONE PLC', translate).tone)).toBe(
      EVENT_TONE.IMPACT,
    )
  })

  it('keeps unknown technical events intact', () => {
    const event = formatEvent('[04:01:03] PLC-01: WRITE REQUEST UNBLOCKED', translate)
    expect(event.tone).toBe(EVENT_TONE.DEFAULT)
    expect(event.message).toContain('PLC-01')
  })
})
