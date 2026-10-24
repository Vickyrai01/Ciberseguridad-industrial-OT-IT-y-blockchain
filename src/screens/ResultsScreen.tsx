import { ChevronRight, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { scenarios } from '../data/scenarios'
import { Stat } from '../components/dashboard/Stat'
import type { GameState } from '../types'

interface ResultsScreenProps {
  state: GameState
  outcome: 'controlled' | 'contingency' | 'critical'
  showHistory: boolean
  onToggleHistory: () => void
  onReplay: () => void
}

export function ResultsScreen({ state, outcome, showHistory, onToggleHistory, onReplay }: ResultsScreenProps) {
  const correct = state.decisionsHistory.filter(
    (entry, index) => scenarios[index].choices.find((choice) => choice.id === entry.choice)?.recommended,
  ).length
  const title =
    outcome === 'controlled' ? 'INCIDENTE CONTROLADO' : outcome === 'critical' ? 'GAME OVER' : 'PLANTA EN CONTINGENCIA'
  const rank =
    correct === 5
      ? 'ARQUITECTO DE RESILIENCIA INDUSTRIAL'
      : correct >= 3
        ? 'ESPECIALISTA EN CIBERSEGURIDAD INDUSTRIAL'
        : correct >= 1
          ? 'ANALISTA OT JUNIOR'
          : 'AMENAZA INTERNA DEL AÑO'
  return (
    <motion.main className={`results ${outcome}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="results-orbit" />
      <div className="results-content">
        <div className="eyebrow">
          <span className="pulse-dot" /> SIMULATION COMPLETE / 04:06:22
        </div>
        <h1>{title}</h1>
        <p className="results-sub">
          {outcome === 'controlled'
            ? 'Las alarmas se estabilizaron. La operación continúa y las capas de defensa respondieron.'
            : outcome === 'critical'
              ? 'La cadena de decisiones cruzó el umbral de seguridad. El fallo mostrado es ficticio y didáctico.'
              : 'La operación se sostuvo con capacidades degradadas. Hay trabajo de recuperación pendiente.'}
        </p>
        <div className="result-stats">
          <Stat
            label="SEGURIDAD"
            value={state.security}
            suffix="/ 100"
            tone={outcome === 'critical' ? 'red' : 'green'}
          />
          <Stat label="PRODUCCIÓN" value={state.production} suffix="%" tone="cyan" />
          <Stat label="SISTEMAS COMPROMETIDOS" value={state.compromisedSystems} suffix="" tone="orange" />
          <div className="result-stat">
            <span>DECISIONES</span>
            <strong>
              {correct}
              <small>/ 5</small>
            </strong>
          </div>
        </div>
        <div className="rank-card">
          <span>CLASIFICACIÓN DE EQUIPO</span>
          <strong>{rank}</strong>
          <small>
            La seguridad industrial no consiste únicamente en impedir ataques: también implica mantener el control del
            proceso, proteger a las personas y recuperar la operación.
          </small>
        </div>
        <div className="results-actions">
          <button className="primary-btn" onClick={onReplay}>
            <RotateCcw size={16} /> VOLVER A JUGAR
          </button>
          <button className="secondary-btn" onClick={onToggleHistory}>
            {showHistory ? 'OCULTAR DECISIONES' : 'REVISAR DECISIONES'} <ChevronRight size={16} />
          </button>
        </div>
        {showHistory && <DecisionHistory state={state} />}
        <p className="closing">
          Blockchain puede proteger la integridad de un registro, pero no reemplaza la seguridad de los sistemas que
          generan los datos.
        </p>
      </div>
    </motion.main>
  )
}

function DecisionHistory({ state }: { state: GameState }) {
  return (
    <div className="history">
      {scenarios.map((scenario, index) => {
        const selected = scenario.choices.find((choice) => choice.id === state.selectedAnswers[index])
        return (
          <div className="history-row" key={scenario.id}>
            <span>0{scenario.id}</span>
            <div>
              <strong>{scenario.title}</strong>
              <small>Elegida: {selected?.label}</small>
              <small className="recommendation">
                Recomendada: {scenario.choices.find((choice) => choice.recommended)?.label}
              </small>
            </div>
          </div>
        )
      })}
    </div>
  )
}
