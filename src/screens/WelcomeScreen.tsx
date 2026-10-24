import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Plant } from '../components/plant/Plant'
import { initialState } from '../engine/simulationEngine'

interface WelcomeScreenProps {
  onStart: () => void
  presenter: boolean
  onTogglePresenter: () => void
}

export function WelcomeScreen({ onStart, presenter, onTogglePresenter }: WelcomeScreenProps) {
  const { t } = useTranslation()
  return (
    <motion.main className="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="welcome-grid" />
      <div className="brand-lockup">
        <span className="eyebrow">
          <span className="pulse-dot" /> {t('common.liveSimulation')}
        </span>
        <h1>
          OT <span>UNDER</span> ATTACK
        </h1>
        <p>{t('common.simulator')}</p>
      </div>
      <div className="hero-plant">
        <Plant state={initialState()} compact />
      </div>
      <div className="welcome-copy">
        <div className="time-mark">
          04:00 AM <span>·</span> {t('common.plantNode')}
        </div>
        <p>{t('welcome.hero')}</p>
        <p className="muted">{t('welcome.description')}</p>
      </div>
      <div className="welcome-actions">
        <button className="primary-btn" onClick={onStart}>
          {t('common.start')} <ChevronRight size={18} />
        </button>
        <button className={`text-btn ${presenter ? 'active' : ''}`} onClick={onTogglePresenter}>
          ◉ {t('common.presenterMode')}
        </button>
      </div>
      <div className="welcome-meta">
        <span>5 {t('common.decisions')}</span>
        <span>{t('common.minutes')}</span>
        <span>{t('common.educational')}</span>
        <span>{t('common.group')}</span>
      </div>
    </motion.main>
  )
}
