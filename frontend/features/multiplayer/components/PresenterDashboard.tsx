import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { initialState } from '../../simulation/engine/simulationEngine'
import { PlantPanel } from '../../simulation/components/PlantPanel'
import { scenarios } from '../../simulation/data/scenarios'
import type { RoomSnapshot } from '../types'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow } from '../../../shared/components/ui/Eyebrow'
import { MultiplayerError } from './MultiplayerError'
import { PresenterMetric } from './PresenterMetric'

interface PresenterDashboardProps {
  room: RoomSnapshot
  error: string | null
  loading: boolean
  onAdvance: () => void
  onFinish: () => void
}

export function PresenterDashboard({ room, error, loading, onAdvance, onFinish }: PresenterDashboardProps) {
  const { t } = useTranslation()
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const questionIndex = Number.isInteger(room.currentQuestionIndex) ? room.currentQuestionIndex : 0
  const totalQuestions = room.scenarioOrder.length
  const plantState = useMemo(() => initialState(room.scenarioOrder), [room.scenarioOrder])
  const scenario = useMemo(
    () => scenarios.find(({ id }) => id === room.scenarioOrder[questionIndex]) ?? scenarios[0],
    [questionIndex, room.scenarioOrder],
  )
  const correctChoice = scenario.choices.find(({ recommended }) => recommended)
  const answeredParticipants = room.leaderboard.filter(
    ({ completedQuestions }) => completedQuestions > questionIndex,
  ).length
  const isLastQuestion = questionIndex === totalQuestions - 1
  const allParticipantsAnswered = room.participants.length > 0 && answeredParticipants === room.participants.length

  useEffect(() => {
    setAnswerRevealed(false)
  }, [questionIndex, scenario.id])

  return (
    <main className="presenter-dashboard presenter-dashboard-layout ot-layout-screen">
      <header className="presenter-dashboard-header presenter-header-layout">
        <div>
          <Eyebrow>{t('multiplayer.presenterMode')}</Eyebrow>
          <h1>{t('multiplayer.questionLabel', { current: questionIndex + 1, total: totalQuestions })}</h1>
        </div>
        <PresenterMetric
          className="presenter-room-code presenter-room-code-layout"
          label={t('multiplayer.roomCode')}
          value={room.code}
        />
      </header>

      <div className="presenter-main-grid presenter-main-grid-layout">
        <div className="presenter-plant-column-layout">
          <PlantPanel state={plantState} />
        </div>
        <div className="presenter-side-panel presenter-side-panel-layout">
          <section className="presenter-question presenter-question-layout" aria-live="polite">
            <Eyebrow>{t(scenario.kickerKey)}</Eyebrow>
            <h2>{t(scenario.titleKey)}</h2>
            <p className="presenter-narrative">{t(scenario.narrativeKey)}</p>
            <p className="presenter-question-copy">{t(scenario.questionKey)}</p>
            <div className="presenter-choices presenter-choices-layout">
              {scenario.choices.map((choice) => (
                <div
                  className={`presenter-choice presenter-choice-layout${answerRevealed && choice.recommended ? ' correct' : ''}`}
                  key={choice.id}>
                  <span className="presenter-choice-key-layout">{choice.id.toUpperCase()}</span>
                  <p>{t(choice.labelKey)}</p>
                  {answerRevealed && choice.recommended && (
                    <strong className="presenter-choice-badge">{t('multiplayer.correctAnswer')}</strong>
                  )}
                </div>
              ))}
              {answerRevealed && correctChoice && (
                <div className="presenter-answer-review" role="status">
                  <Eyebrow>{t('multiplayer.explanation')}</Eyebrow>
                  <p>{t(scenario.insightKey)}</p>
                </div>
              )}
            </div>
          </section>

          <aside className="presenter-progress presenter-progress-layout">
            <PresenterMetric
              className="presenter-progress-row-layout"
              label={t('multiplayer.connectedParticipants')}
              value={room.participants.filter(({ connected }) => connected).length}
            />
            <PresenterMetric
              className="presenter-progress-row-layout"
              label={t('multiplayer.answersReceived')}
              value={`${answeredParticipants}/${room.participants.length}`}
            />
          </aside>
        </div>
      </div>

      <footer className="presenter-dashboard-actions presenter-actions-layout">
        <Button
          variant="secondary"
          type="button"
          className="presenter-reveal-button"
          disabled={!allParticipantsAnswered || answerRevealed || loading}
          onClick={() => setAnswerRevealed(true)}>
          {answerRevealed ? t('multiplayer.answerRevealed') : t('multiplayer.revealAnswer')}
        </Button>
        <Button
          disabled={isLastQuestion || !allParticipantsAnswered || !answerRevealed}
          loading={loading}
          loadingLabel={t('multiplayer.connecting')}
          onClick={onAdvance}>
          {t('multiplayer.nextQuestion')}
        </Button>
        <Button variant="text" disabled={loading} onClick={onFinish}>
          {t('multiplayer.finish')}
        </Button>
      </footer>
      {!isLastQuestion && !allParticipantsAnswered && (
        <p className="presenter-waiting presenter-waiting-layout" role="status">
          {t('multiplayer.waitingForAnswers', { answered: answeredParticipants, total: room.participants.length })}
        </p>
      )}
      <MultiplayerError error={error} />
    </main>
  )
}
