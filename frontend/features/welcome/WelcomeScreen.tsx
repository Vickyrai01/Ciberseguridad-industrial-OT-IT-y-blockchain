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
  onJoin: () => void
  onCreate: () => void
}

export function WelcomeScreen({ onStart, onJoin, onCreate }: WelcomeScreenProps) {
  return (
    <motion.main className="welcome" {...pageMotion} transition={pageTransition}>
      <div className="welcome-grid" />
      <WelcomeBrand />
      <div className="hero-plant">
        <Plant state={initialState()} compact />
      </div>
      <WelcomeCopy />
      <WelcomeActions onStart={onStart} onJoin={onJoin} onCreate={onCreate} />
      <WelcomeMeta />
    </motion.main>
  )
}
