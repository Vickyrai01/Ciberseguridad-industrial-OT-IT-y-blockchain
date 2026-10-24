import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export function EventConsole({ events }: { events: string[] }) {
  const consoleRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight }, [events.length])
  return <section className="console"><div className="console-head"><span><span className="pulse-dot"/> DECISION LOG / EVENT STREAM</span><small>LOCAL / SCROLL TO REVIEW HISTORY</small><Activity size={15}/></div><div className="console-scroll" ref={consoleRef}>{events.map((event, index) => <motion.div className={`event-line ${event.includes('DECISION') ? 'decision' : event.includes('STATE UPDATE') ? 'state-update' : event.includes('IMPACT') ? 'impact' : ''}`} key={`${event}-${index}`} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}><span className="console-arrow">›</span>{event}</motion.div>)}</div></section>
}
