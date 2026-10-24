import { describe, expect, it } from 'vitest'
import { eventToneClass, formatEvent } from './eventLogFormatter'
import { EVENT_TONE, EVENT_TYPE, OPERATIONAL_STATUS, PLANT_ZONE } from '../constants/domain'

const translate = (key: string) => key
const baseEvent = { id: 'test-event', timestamp: '[04:01:00]' }

describe('event log formatter', () => {
  it('classifies and translates decision events', () => {
    const event = formatEvent(
      {
        ...baseEvent,
        type: EVENT_TYPE.DECISION,
        tone: EVENT_TONE.DECISION,
        scenarioId: 1,
        option: 'b',
        recommended: true,
      },
      translate,
    )
    expect(event.tone).toBe(EVENT_TONE.DECISION)
    expect(event.message).toContain('log.decision')
  })

  it('classifies state and impact events', () => {
    expect(
      eventToneClass(
        formatEvent(
          {
            ...baseEvent,
            type: EVENT_TYPE.STATE_UPDATE,
            tone: EVENT_TONE.STATE_UPDATE,
            security: 84,
            production: 100,
            status: OPERATIONAL_STATUS.NORMAL,
          },
          translate,
        ).tone,
      ),
    ).toBe(EVENT_TONE.STATE_UPDATE)
    expect(
      eventToneClass(
        formatEvent(
          {
            ...baseEvent,
            type: EVENT_TYPE.IMPACT,
            tone: EVENT_TONE.IMPACT,
            compromisedSystems: 1,
            zone: PLANT_ZONE.PLC,
          },
          translate,
        ).tone,
      ),
    ).toBe(EVENT_TONE.IMPACT)
  })

  it('keeps unknown technical events intact', () => {
    const event = formatEvent(
      { ...baseEvent, type: EVENT_TYPE.MESSAGE, tone: EVENT_TONE.DEFAULT, messageKey: 'events.plcWriteUnblocked' },
      translate,
    )
    expect(event.tone).toBe(EVENT_TONE.DEFAULT)
    expect(event.message).toContain('events.plcWriteUnblocked')
  })
})
