import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { scenarios } from '../data/scenarios'
import { applyChoice, finalOutcome, initialState } from '../engine/simulationEngine'
import { useSound } from './useSound'
import { shuffleScenarios } from '../utils/shuffleScenarios'
import type { Choice, Screen } from '../types'
import { SCREEN, SOUND_EFFECT } from '../constants/domain'

export function useSimulation() {
  const [screen, setScreen] = useState<Screen>(SCREEN.WELCOME)
  const [state, setState] = useState(initialState)
  const [activeScenarios, setActiveScenarios] = useState(scenarios)
  const [selected, setSelected] = useState<Choice['id'] | null>(null)
  const [sound, setSound] = useState(false)
  const [presenter, setPresenter] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { beep } = useSound(sound)
  const { t } = useTranslation()
  const scenario = activeScenarios[state.currentScenario]

  const startSimulation = () => {
    setActiveScenarios(shuffleScenarios(scenarios))
    setState(initialState())
    setSelected(null)
    setShowHistory(false)
    setScreen(SCREEN.SIMULATION)
    beep(SOUND_EFFECT.CLICK)
  }

  const selectChoice = (choice: Choice) => {
    setSelected(choice.id)
    beep(choice.recommended ? SOUND_EFFECT.SUCCESS : SOUND_EFFECT.ALERT)
  }

  const continueSimulation = () => {
    if (!selected || !scenario) return
    const choice = scenario.choices.find((item) => item.id === selected)
    if (!choice) return
    const nextState = applyChoice(
      state,
      choice,
      state.currentScenario,
      choice.eventKeys.map((key) => t(key)),
    )
    setState(nextState)
    setSelected(null)
    if (nextState.simulationFinished) setScreen(SCREEN.RESULTS)
    beep(SOUND_EFFECT.CLICK)
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.()
    else await document.exitFullscreen?.()
  }

  return {
    screen,
    state,
    scenario,
    selected,
    sound,
    presenter,
    showHistory,
    outcome: finalOutcome(state),
    startSimulation,
    selectChoice,
    continueSimulation,
    setSound,
    setPresenter,
    setShowHistory,
    toggleFullscreen,
  }
}
