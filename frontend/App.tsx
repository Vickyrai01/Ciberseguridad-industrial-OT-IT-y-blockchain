import { MotionConfig } from 'framer-motion'
import { AppScreens } from './app/AppScreens'
import { useAppController } from './app/useAppController'

function App() {
  const controller = useAppController()

  return (
    <div className="app-shell ot-layout-screen">
      <div className="scanlines" />
      <MotionConfig reducedMotion="user">
        <AppScreens controller={controller} />
      </MotionConfig>
    </div>
  )
}

export default App
