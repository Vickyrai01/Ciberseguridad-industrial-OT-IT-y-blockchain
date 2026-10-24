import { useState } from 'react'
import { scenarios } from '../data/scenarios'
import { applyChoice, finalOutcome, initialState } from '../engine/simulationEngine'
import { useSound } from './useSound'
import { shuffleScenarios } from '../utils/shuffleScenarios'
import type { Choice, Screen } from '../types'

export function useSimulation() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [state, setState] = useState(initialState)
  const [activeScenarios, setActiveScenarios] = useState(scenarios)
  const [selected, setSelected] = useState<string | null>(null)
  const [sound, setSound] = useState(false)
  const [presenter, setPresenter] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { beep } = useSound(sound)
  const scenario = activeScenarios[state.currentScenario]

  const startSimulation = () => {
    setActiveScenarios(shuffleScenarios(scenarios))
    setState(initialState())
    setSelected(null)
    setShowHistory(false)
    setScreen('simulation')
    beep('click')
  }

  const selectChoice = (choice: Choice) => {
    setSelected(choice.id)
    beep(choice.recommended ? 'success' : 'alert')
  }

  const continueSimulation = () => {
    if (!selected || !scenario) return
    const choice = scenario.choices.find((item) => item.id === selected)
    if (!choice) return
    const nextState = applyChoice(state, choice, state.currentScenario)
    setState(nextState)
    setSelected(null)
    if (nextState.simulationFinished) setScreen('results')
    beep('click')
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.()
    else await document.exitFullscreen?.()
  }

  return { screen, state, scenario, selected, sound, presenter, showHistory, outcome: finalOutcome(state), startSimulation, selectChoice, continueSimulation, setSound, setPresenter, setShowHistory, toggleFullscreen }
}
