import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Plant } from '../components/plant/Plant'
import { initialState } from '../engine/simulationEngine'

interface WelcomeScreenProps { onStart: () => void; presenter: boolean; onTogglePresenter: () => void }

export function WelcomeScreen({ onStart, presenter, onTogglePresenter }: WelcomeScreenProps) {
  return <motion.main className="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="welcome-grid"/><div className="brand-lockup"><span className="eyebrow"><span className="pulse-dot"/> LIVE SIMULATION / OT-SECURITY LAB</span><h1>OT <span>UNDER</span> ATTACK</h1><p>Industrial Cybersecurity Simulator</p></div><div className="hero-plant"><Plant state={initialState()} compact/></div><div className="welcome-copy"><div className="time-mark">04:00 AM <span>·</span> PLANT NODE 07</div><p>Una planta industrial. Un incidente de seguridad. Tus decisiones determinan lo que ocurre.</p><p className="muted">Son las 04:00 AM. La operación es normal. En los próximos minutos, una serie de amenazas pondrá a prueba la seguridad de sus sistemas.</p></div><div className="welcome-actions"><button className="primary-btn" onClick={onStart}>INICIAR SIMULACIÓN <ChevronRight size={18}/></button><button className={`text-btn ${presenter ? 'active' : ''}`} onClick={onTogglePresenter}>◉ MODO PRESENTADOR</button></div><div className="welcome-meta"><span>5 DECISIONES</span><span>~ 06 MINUTOS</span><span>SIMULACIÓN EDUCATIVA</span><span>GRUPO 3 · UTN FRBA</span></div></motion.main>
}
