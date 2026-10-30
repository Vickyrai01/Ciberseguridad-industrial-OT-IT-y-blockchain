import { MotionConfig } from 'framer-motion'
import { AppControls } from './app/AppControls'
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
      <AppControls simulation={controller.simulation} />
    </div>
  )
}

export default App
