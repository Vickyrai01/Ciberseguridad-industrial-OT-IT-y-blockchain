import { AnimatePresence } from 'framer-motion'
import { MultiplayerScreen } from '../features/multiplayer/components/MultiplayerScreen'
import { MultiplayerLeaderboard } from '../features/multiplayer/components/MultiplayerLeaderboard'
import { PresenterDashboard } from '../features/multiplayer/components/PresenterDashboard'
import { ResultsScreen } from '../features/results/ResultsScreen'
import { SimulationScreen } from '../features/simulation/SimulationScreen'
import { WelcomeScreen } from '../features/welcome/WelcomeScreen'
import { SCREEN } from '../shared/constants/domain'
import type { AppController } from './useAppController'
import { MULTIPLAYER_MODE, MULTIPLAYER_VIEW_MODES } from '../features/multiplayer/constants'

interface AppScreensProps {
  controller: AppController
}

export function AppScreens({ controller }: AppScreensProps) {
  const { multiplayer, simulation } = controller
  return (
    <AnimatePresence mode="wait">
      {simulation.screen === SCREEN.WELCOME && multiplayer.mode === MULTIPLAYER_MODE.IDLE && (
        <WelcomeScreen
          onStart={simulation.startSimulation}
          presenter={simulation.presenter}
          onTogglePresenter={simulation.togglePresenter}
          onJoin={multiplayer.enter}
          onCreate={multiplayer.createRoom}
        />
      )}
      {MULTIPLAYER_VIEW_MODES.includes(multiplayer.mode as (typeof MULTIPLAYER_VIEW_MODES)[number]) && (
        <MultiplayerScreen
          mode={multiplayer.mode as (typeof MULTIPLAYER_VIEW_MODES)[number]}
          configured={multiplayer.configured}
          session={multiplayer.session}
          room={multiplayer.room}
          error={multiplayer.error}
          loading={multiplayer.loading}
          onJoin={multiplayer.joinRoom}
          onCreate={multiplayer.createRoom}
          onStart={multiplayer.session?.presenterToken ? multiplayer.startRoom : multiplayer.startPlayer}
          onFinish={multiplayer.finishRoom}
          onBack={multiplayer.reset}
        />
      )}
      {simulation.screen === SCREEN.SIMULATION &&
        simulation.scenario &&
        (multiplayer.mode === MULTIPLAYER_MODE.IDLE ||
          (multiplayer.mode === MULTIPLAYER_MODE.PLAYING && !multiplayer.session?.presenterToken)) && (
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
            onReset={multiplayer.mode === MULTIPLAYER_MODE.PLAYING ? () => undefined : simulation.startSimulation}
          />
        )}
      {multiplayer.mode === MULTIPLAYER_MODE.PLAYING && multiplayer.session?.presenterToken && multiplayer.room && (
        <PresenterDashboard room={multiplayer.room} onFinish={multiplayer.finishRoom} />
      )}
      {multiplayer.mode === MULTIPLAYER_MODE.PLAYING && simulation.screen === SCREEN.RESULTS && multiplayer.room && (
        <MultiplayerLeaderboard
          entries={multiplayer.room.leaderboard}
          currentParticipantId={multiplayer.session?.participantId}
          floating
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
  )
}
