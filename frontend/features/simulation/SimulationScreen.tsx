import { motion } from 'framer-motion'
import { EventConsole } from '../../shared/components/layout/EventConsole'
import { Topbar } from '../../shared/components/layout/Topbar'
import { ConceptChip } from './components/ConceptChip'
import { PlantPanel } from './components/PlantPanel'
import { ScenarioBriefing } from './components/ScenarioBriefing'
import { ScenarioProgress } from './components/ScenarioProgress'
import { WaitingForPresenterModal } from './components/WaitingForPresenterModal'
import type { Choice, GameState, Scenario } from '../../types'
import { OPERATIONAL_STATUS } from '../../shared/constants/domain'
import { pageMotion, pageTransition } from '../../animations/motionTokens'

interface SimulationScreenProps {
  state: GameState
  scenario: Scenario
  selected: Choice['id'] | null
  sound: boolean
  onSelect: (choice: Choice) => void
  onContinue: () => void
  onToggleSound: () => void
  onFullscreen: () => void
  onReset: () => void
  waitingForPresenter: boolean
  submitting: boolean
  error: string | null
}

export function SimulationScreen({
  state,
  scenario,
  selected,
  sound,
  onSelect,
  onContinue,
  onToggleSound,
  onFullscreen,
  onReset,
  waitingForPresenter,
  submitting,
  error,
}: SimulationScreenProps) {
  return (
    <motion.main
      className={`simulation ot-layout-screen ${state.operationalStatus === OPERATIONAL_STATUS.CRITICAL ? 'critical' : ''}`}
      {...pageMotion}
      transition={pageTransition}>
      <Topbar state={state} sound={sound} onToggleSound={onToggleSound} onFullscreen={onFullscreen} onReset={onReset} />
      <div className="sim-grid mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)] gap-[2.5vw] px-[3vw] pb-[18px] pt-[26px] max-[900px]:grid-cols-1 max-[900px]:pt-[18px] max-[520px]:px-[14px] max-[520px]:py-[18px]">
        <PlantPanel state={state} />
        <aside className="control-column">
          <ScenarioProgress scenario={scenario} />
          <ScenarioBriefing
            state={state}
            scenario={scenario}
            selected={selected}
            onSelect={onSelect}
            onContinue={onContinue}
            waitingForPresenter={waitingForPresenter}
            submitting={submitting}
            error={error}
          />
          <ConceptChip conceptKey={scenario.conceptKey} />
        </aside>
      </div>
      <EventConsole events={state.eventLog} />
      {waitingForPresenter && <WaitingForPresenterModal />}
    </motion.main>
  )
}
