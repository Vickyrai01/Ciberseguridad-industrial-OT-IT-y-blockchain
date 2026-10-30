import { useCallback, useReducer } from 'react'
import { scenarios } from '../data/scenarios'
import { applyChoice, finalOutcome, initialState } from '../engine/simulationEngine'
import { SCREEN, SOUND_EFFECT } from '../../../shared/constants/domain'
import type { Choice, GameState, Scenario, Screen } from '../../../types'
import { shuffleScenarios } from '../../../shared/utils/shuffleScenarios'
import { useSound } from '../../../shared/hooks/useSound'

interface SimulationOptions {
  scenarioOrder?: number[]
  onSubmitAnswer?: (scenarioId: number, choiceId: Choice['id']) => Promise<unknown>
}

interface PendingAnswer {
  scenarioId: number
  choiceId: Choice['id']
}

interface SimulationViewState {
  screen: Screen
  state: GameState
  activeScenarios: Scenario[]
  selected: Choice['id'] | null
  sound: boolean
  presenter: boolean
  showHistory: boolean
  pendingAnswer: PendingAnswer | null
  waitingForPresenter: boolean
}

type SimulationAction =
  | { type: 'START'; scenarios: Scenario[]; startIndex: number }
  | { type: 'SELECT_CHOICE'; choiceId: Choice['id'] }
  | { type: 'APPLY_STATE'; state: GameState }
  | { type: 'WAIT_FOR_PRESENTER'; answer: PendingAnswer }
  | { type: 'APPLY_PENDING'; scenario: Scenario }
  | { type: 'CLEAR_PENDING' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_PRESENTER' }
  | { type: 'TOGGLE_HISTORY' }

const createInitialViewState = (): SimulationViewState => ({
  screen: SCREEN.WELCOME,
  state: initialState(),
  activeScenarios: scenarios,
  selected: null,
  sound: false,
  presenter: false,
  showHistory: false,
  pendingAnswer: null,
  waitingForPresenter: false,
})

function simulationReducer(state: SimulationViewState, action: SimulationAction): SimulationViewState {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        screen: SCREEN.SIMULATION,
        state: initialState(
          action.scenarios.map(({ id }) => id),
          action.startIndex,
        ),
        activeScenarios: action.scenarios,
        selected: null,
        showHistory: false,
        pendingAnswer: null,
        waitingForPresenter: false,
      }
    case 'SELECT_CHOICE':
      return { ...state, selected: action.choiceId }
    case 'APPLY_STATE':
      return {
        ...state,
        state: action.state,
        selected: null,
        screen: action.state.simulationFinished ? SCREEN.RESULTS : SCREEN.SIMULATION,
        pendingAnswer: null,
        waitingForPresenter: false,
      }
    case 'WAIT_FOR_PRESENTER':
      return { ...state, pendingAnswer: action.answer, waitingForPresenter: true }
    case 'APPLY_PENDING': {
      if (!state.pendingAnswer) return state
      const choice = action.scenario.choices.find(({ id }) => id === state.pendingAnswer?.choiceId)
      if (!choice || choice.id !== state.pendingAnswer.choiceId) return state
      const nextState = applyChoice(state.state, action.scenario, choice, choice.eventKeys)
      return {
        ...state,
        state: nextState,
        selected: null,
        pendingAnswer: null,
        waitingForPresenter: false,
        screen: nextState.simulationFinished ? SCREEN.RESULTS : SCREEN.SIMULATION,
      }
    }
    case 'CLEAR_PENDING':
      return { ...state, pendingAnswer: null, waitingForPresenter: false }
    case 'TOGGLE_SOUND':
      return { ...state, sound: !state.sound }
    case 'TOGGLE_PRESENTER':
      return { ...state, presenter: !state.presenter }
    case 'TOGGLE_HISTORY':
      return { ...state, showHistory: !state.showHistory }
  }
}

export function useSimulation(options: SimulationOptions = {}) {
  const [view, dispatch] = useReducer(simulationReducer, undefined, createInitialViewState)
  const { beep } = useSound(view.sound)
  const scenario = view.activeScenarios[view.state.currentScenario]
  const { onSubmitAnswer } = options

  const startSimulation = useCallback(
    (requestedOrder?: number[], startIndex = 0) => {
      const shuffledScenarios = requestedOrder
        ? requestedOrder
            .map((id) => scenarios.find((item) => item.id === id))
            .filter((item): item is Scenario => Boolean(item))
        : shuffleScenarios(scenarios)
      dispatch({ type: 'START', scenarios: shuffledScenarios, startIndex })
      beep(SOUND_EFFECT.CLICK)
    },
    [beep],
  )

  const selectChoice = useCallback(
    (choice: Choice) => {
      dispatch({ type: 'SELECT_CHOICE', choiceId: choice.id })
      beep(choice.recommended ? SOUND_EFFECT.SUCCESS : SOUND_EFFECT.ALERT)
    },
    [beep],
  )

  const continueSimulation = useCallback(async () => {
    if (!view.selected || !scenario) return
    const choice = scenario.choices.find((item) => item.id === view.selected)
    if (!choice) return
    if (onSubmitAnswer) {
      await onSubmitAnswer(scenario.id, choice.id)
      dispatch({ type: 'WAIT_FOR_PRESENTER', answer: { scenarioId: scenario.id, choiceId: choice.id } })
    } else {
      dispatch({ type: 'APPLY_STATE', state: applyChoice(view.state, scenario, choice, choice.eventKeys) })
    }
    beep(SOUND_EFFECT.CLICK)
  }, [beep, onSubmitAnswer, scenario, view.selected, view.state])

  const advanceToQuestion = useCallback(
    (questionIndex: number) => {
      if (questionIndex <= view.state.currentScenario || !view.pendingAnswer || !scenario) return
      dispatch({ type: 'APPLY_PENDING', scenario })
    },
    [scenario, view.pendingAnswer, view.state.currentScenario],
  )

  const applyPendingAnswer = useCallback(() => {
    if (!view.pendingAnswer || !scenario) return
    dispatch({ type: 'APPLY_PENDING', scenario })
  }, [scenario, view.pendingAnswer])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.()
      else await document.exitFullscreen?.()
    } catch {
      // Fullscreen can be rejected by the browser or the current document context.
    }
  }

  return {
    screen: view.screen,
    state: view.state,
    scenario,
    selected: view.selected,
    sound: view.sound,
    presenter: view.presenter,
    showHistory: view.showHistory,
    waitingForPresenter: view.waitingForPresenter,
    outcome: finalOutcome(view.state),
    startSimulation,
    selectChoice,
    continueSimulation,
    advanceToQuestion,
    applyPendingAnswer,
    toggleSound: () => dispatch({ type: 'TOGGLE_SOUND' }),
    togglePresenter: () => dispatch({ type: 'TOGGLE_PRESENTER' }),
    toggleHistory: () => dispatch({ type: 'TOGGLE_HISTORY' }),
    toggleFullscreen,
  }
}
