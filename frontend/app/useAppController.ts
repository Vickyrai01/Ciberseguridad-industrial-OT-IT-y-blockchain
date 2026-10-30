import { useEffect } from 'react'
import { SCREEN } from '../shared/constants/domain'
import { useMultiplayer } from '../features/multiplayer/hooks/useMultiplayer'
import { useSimulation } from '../features/simulation/hooks/useSimulation'
import { MULTIPLAYER_MODE, ROOM_STATUS } from '../features/multiplayer/constants'

export function useAppController() {
  const multiplayer = useMultiplayer()
  const { mode, scenarioOrder, resume, enter, openQuestion, startPlayer, room, session, submitAnswer } = multiplayer
  const simulation = useSimulation({
    onSubmitAnswer: mode === MULTIPLAYER_MODE.PLAYING ? submitAnswer : undefined,
  })
  const { screen, scenario, startSimulation, advanceToQuestion, applyPendingAnswer } = simulation
  const activeScenarioId = scenario?.id

  useEffect(() => {
    resume()
    if (new URLSearchParams(window.location.search).has('room')) enter()
  }, [enter, resume])

  useEffect(() => {
    if (mode === MULTIPLAYER_MODE.PLAYING && !session?.presenterToken && screen === SCREEN.WELCOME) {
      startSimulation(scenarioOrder, room?.currentQuestionIndex ?? 0)
    }
  }, [mode, room?.currentQuestionIndex, scenarioOrder, screen, session?.presenterToken, startSimulation])

  useEffect(() => {
    if (mode === MULTIPLAYER_MODE.PLAYING && !session?.presenterToken && room) {
      advanceToQuestion(room.currentQuestionIndex)
    }
  }, [advanceToQuestion, mode, room?.currentQuestionIndex, room, session?.presenterToken])

  useEffect(() => {
    if (!session?.presenterToken && room?.status === ROOM_STATUS.FINISHED) {
      applyPendingAnswer()
    }
  }, [applyPendingAnswer, mode, room?.status, session?.presenterToken, room])

  useEffect(() => {
    if (mode === MULTIPLAYER_MODE.PLAYING && !session?.presenterToken && activeScenarioId !== undefined) {
      openQuestion(activeScenarioId)
    }
  }, [activeScenarioId, mode, openQuestion, session?.presenterToken])

  useEffect(() => {
    if (mode === MULTIPLAYER_MODE.LOBBY && room?.status === ROOM_STATUS.IN_PROGRESS && !session?.presenterToken) {
      startPlayer()
    }
  }, [mode, room?.status, session?.presenterToken, startPlayer])

  return { multiplayer, simulation }
}

export type AppController = ReturnType<typeof useAppController>
