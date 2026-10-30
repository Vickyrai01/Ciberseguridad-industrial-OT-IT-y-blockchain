import { motion } from 'framer-motion'
import { EventConsole } from '../../shared/components/layout/EventConsole'
import { Topbar } from '../../shared/components/layout/Topbar'
import { ConceptChip } from './components/ConceptChip'
import { PlantPanel } from './components/PlantPanel'
import { ScenarioBriefing } from './components/ScenarioBriefing'
import { ScenarioProgress } from './components/ScenarioProgress'
import type { Choice, GameState, Scenario } from '../../types'
import { OPERATIONAL_STATUS } from '../../shared/constants/domain'
import { pageMotion, pageTransition } from '../../animations/motionTokens'

interface SimulationScreenProps {
  state: GameState
  scenario: Scenario
  selected: Choice['id'] | null
  presenter: boolean
  sound: boolean
  onSelect: (choice: Choice) => void
  onContinue: () => void
  onToggleSound: () => void
  onFullscreen: () => void
  onReset: () => void
}

export function SimulationScreen({
  state,
  scenario,
  selected,
  presenter,
  sound,
  onSelect,
  onContinue,
  onToggleSound,
  onFullscreen,
  onReset,
}: SimulationScreenProps) {
  return (
    <motion.main
      className={`simulation ot-layout-screen ${state.operationalStatus === OPERATIONAL_STATUS.CRITICAL ? 'critical' : ''}`}
      {...pageMotion}
      transition={pageTransition}>
      <Topbar state={state} sound={sound} onToggleSound={onToggleSound} onFullscreen={onFullscreen} onReset={onReset} />
      <div className="sim-grid">
        <PlantPanel state={state} />
        <aside className="control-column">
          <ScenarioProgress scenario={scenario} />
          <ScenarioBriefing
            state={state}
            scenario={scenario}
            selected={selected}
            onSelect={onSelect}
            onContinue={onContinue}
          />
          <ConceptChip conceptKey={scenario.conceptKey} presenter={presenter} />
        </aside>
      </div>
      <EventConsole events={state.eventLog} />
    </motion.main>
  )
}
