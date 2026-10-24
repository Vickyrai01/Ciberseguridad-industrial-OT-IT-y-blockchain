import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function EventConsole({ events }: { events: string[] }) {
  const { t } = useTranslation()
  const consoleRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight
  }, [events.length])
  const formatEvent = (event: string) => {
    const decision = event.match(
      /^(\[[^\]]+\]) DECISION (\d+\/05): OPTION ([ABC]) SELECTED · (RECOMMENDED|RISK DETECTED)$/,
    )
    if (decision)
      return `${decision[1]} ${t('log.decision')} ${decision[2]}: ${t('log.option')} ${decision[3]} ${t('log.selected')} · ${decision[4] === 'RECOMMENDED' ? t('log.recommended') : t('log.riskDetected')}`
    const stateUpdate = event.match(
      /^(\[[^\]]+\]) STATE UPDATE: SECURITY (\d+)\/100 · PRODUCTION (\d+)% · STATUS ([A-Z]+)$/,
    )
    if (stateUpdate)
      return `${stateUpdate[1]} ${t('log.stateUpdate')}: ${t('log.security')} ${stateUpdate[2]}/100 · ${t('log.production')} ${stateUpdate[3]}% · ${t('log.status')} ${t(`status.${stateUpdate[4].toLowerCase()}`)}`
    const impact = event.match(/^(\[[^\]]+\]) IMPACT: (\d+) SYSTEM(S)? COMPROMISED · ZONE ([A-Z]+)$/)
    if (impact)
      return `${impact[1]} ${t('log.impact')}: ${impact[2]} ${impact[3] === '1' ? t('log.system') : t('log.systems')} ${t('log.compromised')} · ${t('log.zone')} ${impact[5]}`
    return event
      .replace('SYSTEM INITIALIZED', t('log.systemInitialized'))
      .replace('PLC-01 STATUS: RUN', t('log.plcRun'))
      .replace('SCADA TELEMETRY: NOMINAL', t('log.scadaNominal'))
  }
  return (
    <section className="console">
      <div className="console-head">
        <span>
          <span className="pulse-dot" /> {t('common.decisionLog')}
        </span>
        <small>{t('common.localScroll')}</small>
        <Activity size={15} />
      </div>
      <div className="console-scroll" ref={consoleRef}>
        {events.map((event, index) => (
          <motion.div
            className={`event-line ${event.includes('DECISION') ? 'decision' : event.includes('STATE UPDATE') ? 'state-update' : event.includes('IMPACT') ? 'impact' : ''}`}
            key={`${event}-${index}`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}>
            <span className="console-arrow">›</span>
            {formatEvent(event)}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
