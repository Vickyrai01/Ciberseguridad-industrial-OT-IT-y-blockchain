import { motion } from 'framer-motion'
import { pageMotion, pageTransition } from '../animations/motionTokens'
import { Plant } from '../components/plant/Plant'
import { WelcomeActions } from '../components/welcome/WelcomeActions'
import { WelcomeBrand } from '../components/welcome/WelcomeBrand'
import { WelcomeCopy } from '../components/welcome/WelcomeCopy'
import { WelcomeMeta } from '../components/welcome/WelcomeMeta'
import { initialState } from '../engine/simulationEngine'

interface WelcomeScreenProps {
  onStart: () => void
  presenter: boolean
  onTogglePresenter: () => void
}

export function WelcomeScreen({ onStart, presenter, onTogglePresenter }: WelcomeScreenProps) {
  return (
    <motion.main className="welcome" {...pageMotion} transition={pageTransition}>
      <div className="welcome-grid" />
      <WelcomeBrand />
      <div className="hero-plant">
        <Plant state={initialState()} compact />
      </div>
      <WelcomeCopy />
      <WelcomeActions presenter={presenter} onStart={onStart} onTogglePresenter={onTogglePresenter} />
      <WelcomeMeta />
    </motion.main>
  )
}
