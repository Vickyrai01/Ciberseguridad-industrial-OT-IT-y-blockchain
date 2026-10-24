import { AnimatePresence, MotionConfig } from 'framer-motion'
import { CircleDot } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ResultsScreen } from './screens/ResultsScreen'
import { SimulationScreen } from './screens/SimulationScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { useSimulation } from './hooks/useSimulation'
import { SCREEN } from './constants/domain'

function App() {
  const simulation = useSimulation()
  const { t } = useTranslation()
  return (
    <div className="app-shell ot-layout-screen">
      <div className="scanlines" />
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          {simulation.screen === SCREEN.WELCOME && (
            <WelcomeScreen
              onStart={simulation.startSimulation}
              presenter={simulation.presenter}
              onTogglePresenter={simulation.togglePresenter}
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
              onToggleSound={simulation.toggleSound}
              onFullscreen={simulation.toggleFullscreen}
              onReset={simulation.startSimulation}
            />
          )}
          {simulation.screen === SCREEN.RESULTS && (
            <ResultsScreen
              state={simulation.state}
              outcome={simulation.outcome}
              showHistory={simulation.showHistory}
              onToggleHistory={simulation.toggleHistory}
              onReplay={simulation.startSimulation}
            />
          )}
        </AnimatePresence>
      </MotionConfig>
      <button
        type="button"
        className="floating-help"
        title={t('common.controls')}
        aria-label={t('common.controls')}
        aria-pressed={simulation.presenter}
        onClick={simulation.togglePresenter}>
        <CircleDot size={16} />
      </button>
    </div>
  )
}

export default App
