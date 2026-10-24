import { AnimatePresence, MotionConfig } from 'framer-motion'
import { CircleDot } from 'lucide-react'
import { ResultsScreen } from './screens/ResultsScreen'
import { SimulationScreen } from './screens/SimulationScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { useSimulation } from './hooks/useSimulation'
import { SCREEN } from './constants/domain'

function App() {
  const simulation = useSimulation()
  return (
    <div className="app-shell ot-layout-screen">
      <div className="scanlines" />
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          {simulation.screen === SCREEN.WELCOME && (
            <WelcomeScreen
              onStart={simulation.startSimulation}
              presenter={simulation.presenter}
              onTogglePresenter={() => simulation.setPresenter(!simulation.presenter)}
            />
          )}
          {simulation.screen === SCREEN.SIMULATION && simulation.scenario && (
            <SimulationScreen
              state={simulation.state}
              scenario={simulation.scenario}
              selected={simulation.selected}
              presenter={simulation.presenter}
              sound={simulation.sound}
              onSelect={simulation.selectChoice}
              onContinue={simulation.continueSimulation}
              onToggleSound={() => simulation.setSound(!simulation.sound)}
              onFullscreen={simulation.toggleFullscreen}
              onReset={simulation.startSimulation}
            />
          )}
          {simulation.screen === SCREEN.RESULTS && (
            <ResultsScreen
              state={simulation.state}
              outcome={simulation.outcome}
              showHistory={simulation.showHistory}
              onToggleHistory={() => simulation.setShowHistory(!simulation.showHistory)}
              onReplay={simulation.startSimulation}
            />
          )}
        </AnimatePresence>
      </MotionConfig>
      <button
        className="floating-help"
        title="Controles"
        onClick={() => simulation.setPresenter(!simulation.presenter)}>
        <CircleDot size={16} />
      </button>
    </div>
  )
}

export default App
