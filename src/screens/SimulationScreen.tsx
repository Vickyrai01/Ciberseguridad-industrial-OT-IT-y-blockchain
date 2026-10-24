import { motion } from 'framer-motion'
import { AlertTriangle, Check, ChevronRight, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EventConsole } from '../components/layout/EventConsole'
import { Topbar } from '../components/layout/Topbar'
import { Plant } from '../components/plant/Plant'
import type { Choice, GameState, Scenario } from '../types'

interface SimulationScreenProps {
  state: GameState
  scenario: Scenario
  selected: string | null
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
  const { t } = useTranslation()
  const selectedChoice = scenario.choices.find((choice) => choice.id === selected)
  return (
    <motion.main
      className={`simulation ot-layout-screen ${state.operationalStatus === 'critical' ? 'critical' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <Topbar state={state} sound={sound} onToggleSound={onToggleSound} onFullscreen={onFullscreen} onReset={onReset} />
      <div className="sim-grid">
        <section className="plant-column">
          <div className="section-tag ot-mono-label">
            <span className="pulse-dot" /> {t('common.plantTwin')}{' '}
            <span className="tag-right">{t('common.simulatedEducational')}</span>
          </div>
          <div className="plant-frame ot-panel-surface">
            <Plant state={state} />
          </div>
          <div className="plant-caption">
            <span>
              <i className="legend-dot green" /> {t('common.operating')}
            </span>
            <span>
              <i className="legend-dot yellow" /> {t('common.monitoring')}
            </span>
            <span>
              <i className="legend-dot red" /> {t('common.compromised')}
            </span>
          </div>
        </section>
        <aside className="control-column">
          <div className="scenario-progress">
            <div>
              <span className="eyebrow">{t('common.threatBriefing')}</span>
              <strong>
                {String(scenario.id).padStart(2, '0')} <small>/ 05</small>
              </strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${(scenario.id / 5) * 100}%` }} />
            </div>
          </div>
          <motion.div
            key={scenario.id}
            className="briefing ot-panel-surface"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}>
            <div className="brief-kicker">{t(scenario.kickerKey)}</div>
            <h2>{t(scenario.titleKey)}</h2>
            <p className="narrative">{t(scenario.narrativeKey)}</p>
            <div className="question">
              <span>{t('common.yourCall')}</span>
              <p>{t(scenario.questionKey)}</p>
            </div>
            <div className="choices">
              {scenario.choices.map((choice, index) => (
                <button
                  key={choice.id}
                  className={`choice ot-focus-ring ${selected === choice.id ? 'chosen' : ''}`}
                  onClick={() => onSelect(choice)}>
                  <span className="choice-key">{String.fromCharCode(65 + index)}</span>
                  <span>{t(choice.labelKey)}</span>
                  {selected === choice.id && <Check size={16} />}
                </button>
              ))}
            </div>
            {selectedChoice && (
              <div className={`feedback ${selectedChoice.recommended ? 'good' : 'warn'}`}>
                <div className="feedback-icon">
                  {selectedChoice.recommended ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                </div>
                <div>
                  <strong>
                    {selectedChoice.recommended ? t('common.recommended') : t('common.consequenceDetected')}
                  </strong>
                  <p>{t(selectedChoice.consequenceKey)}</p>
                </div>
              </div>
            )}
            <button className="continue-btn ot-focus-ring" disabled={!selected} onClick={onContinue}>
              {state.currentScenario === 4 ? t('common.seeResult') : t('common.applyDecision')}{' '}
              <ChevronRight size={17} />
            </button>
          </motion.div>
          <div className="concept-chip">
            <span>{t('common.keyConcept')}</span>
            <strong>{t(scenario.conceptKey)}</strong>
            {presenter && <small>{t('common.suggestedTime')}</small>}
          </div>
        </aside>
      </div>
      <EventConsole events={state.eventLog} />
    </motion.main>
  )
}
