import { useReducer } from 'react'
import { scenarios } from '../data/scenarios'
import { applyChoice, finalOutcome, initialState } from '../engine/simulationEngine'
import { SCREEN, SOUND_EFFECT } from '../constants/domain'
import type { Choice, GameState, Scenario, Screen } from '../types'
import { shuffleScenarios } from '../utils/shuffleScenarios'
import { useSound } from './useSound'

interface SimulationViewState {
  screen: Screen
  state: GameState
  activeScenarios: Scenario[]
  selected: Choice['id'] | null
  sound: boolean
  presenter: boolean
  showHistory: boolean
}

type SimulationAction =
  | { type: 'START'; scenarios: Scenario[] }
  | { type: 'SELECT_CHOICE'; choiceId: Choice['id'] }
  | { type: 'APPLY_STATE'; state: GameState }
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
})

function simulationReducer(state: SimulationViewState, action: SimulationAction): SimulationViewState {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        screen: SCREEN.SIMULATION,
        state: initialState(action.scenarios.map(({ id }) => id)),
        activeScenarios: action.scenarios,
        selected: null,
        showHistory: false,
      }
    case 'SELECT_CHOICE':
      return { ...state, selected: action.choiceId }
    case 'APPLY_STATE':
      return {
        ...state,
        state: action.state,
        selected: null,
        screen: action.state.simulationFinished ? SCREEN.RESULTS : SCREEN.SIMULATION,
      }
    case 'TOGGLE_SOUND':
      return { ...state, sound: !state.sound }
    case 'TOGGLE_PRESENTER':
      return { ...state, presenter: !state.presenter }
    case 'TOGGLE_HISTORY':
      return { ...state, showHistory: !state.showHistory }
  }
}

export function useSimulation() {
  const [view, dispatch] = useReducer(simulationReducer, undefined, createInitialViewState)
  const { beep } = useSound(view.sound)
  const scenario = view.activeScenarios[view.state.currentScenario]

  const startSimulation = () => {
    const shuffledScenarios = shuffleScenarios(scenarios)
    dispatch({ type: 'START', scenarios: shuffledScenarios })
    beep(SOUND_EFFECT.CLICK)
  }

  const selectChoice = (choice: Choice) => {
    dispatch({ type: 'SELECT_CHOICE', choiceId: choice.id })
    beep(choice.recommended ? SOUND_EFFECT.SUCCESS : SOUND_EFFECT.ALERT)
  }

  const continueSimulation = () => {
    if (!view.selected || !scenario) return
    const choice = scenario.choices.find((item) => item.id === view.selected)
    if (!choice) return
    dispatch({ type: 'APPLY_STATE', state: applyChoice(view.state, scenario, choice, choice.eventKeys) })
    beep(SOUND_EFFECT.CLICK)
  }

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
    outcome: finalOutcome(view.state),
    startSimulation,
    selectChoice,
    continueSimulation,
    toggleSound: () => dispatch({ type: 'TOGGLE_SOUND' }),
    togglePresenter: () => dispatch({ type: 'TOGGLE_PRESENTER' }),
    toggleHistory: () => dispatch({ type: 'TOGGLE_HISTORY' }),
    toggleFullscreen,
  }
}
