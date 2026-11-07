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
    <motion.main
      className="welcome relative flex min-h-screen flex-col justify-center px-[7vw] py-[7vh] max-[900px]:px-[8vw] max-[900px]:py-[10vh]"
      {...pageMotion}
      transition={pageTransition}>
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
