import { motion } from 'framer-motion'
import { EventConsole } from '../components/layout/EventConsole'
import { Topbar } from '../components/layout/Topbar'
import { ConceptChip } from '../components/simulation/ConceptChip'
import { PlantPanel } from '../components/simulation/PlantPanel'
import { ScenarioBriefing } from '../components/simulation/ScenarioBriefing'
import { ScenarioProgress } from '../components/simulation/ScenarioProgress'
import type { Choice, GameState, Scenario } from '../types'
import { OPERATIONAL_STATUS } from '../constants/domain'
import { pageMotion, pageTransition } from '../animations/motionTokens'

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
