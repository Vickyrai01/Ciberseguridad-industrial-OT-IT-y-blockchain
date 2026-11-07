import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { eventMotion, eventTransition } from '../../../animations/motionTokens'
import { eventToneClass, formatEvent } from '../../utils/eventLogFormatter'
import type { EventLogEntry } from '../../../types'

export function EventConsole({ events }: { events: EventLogEntry[] }) {
  const { t } = useTranslation()
  const consoleRef = useRef<HTMLDivElement>(null)
  const formattedEvents = useMemo(() => events.map((event) => formatEvent(event, t)), [events, t])
  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight
  }, [events.length])
  return (
    <section className="console console-layout" aria-label={t('common.decisionLog')}>
      <div className="console-head console-head-layout">
        <span>
          <span className="pulse-dot" /> {t('common.decisionLog')}
        </span>
        <small>{t('common.localScroll')}</small>
        <Activity size={15} />
      </div>
      <div className="console-scroll console-scroll-layout" ref={consoleRef} role="log" aria-live="polite">
        {formattedEvents.map((event) => (
          <motion.div
            className={`event-line ${eventToneClass(event.tone)}`}
            key={event.id}
            {...eventMotion}
            transition={eventTransition}>
            <span className="console-arrow">›</span>
            {event.message}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
