import { motion } from 'framer-motion'
import { pageMotion, pageTransition } from '../../animations/motionTokens'
import { Plant } from '../plant/components/Plant'
import { WelcomeActions } from './WelcomeActions'
import { WelcomeBrand } from './WelcomeBrand'
import { WelcomeCopy } from './WelcomeCopy'
import { WelcomeMeta } from './WelcomeMeta'
import { initialState } from '../simulation/engine/simulationEngine'

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
