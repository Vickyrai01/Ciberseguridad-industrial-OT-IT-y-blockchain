import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { initialState } from '../../simulation/engine/simulationEngine'
import { PlantPanel } from '../../simulation/components/PlantPanel'
import { scenarios } from '../../simulation/data/scenarios'
import type { RoomSnapshot } from '../types'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'

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
    <main className="presenter-dashboard ot-layout-screen">
      <header className="presenter-dashboard-header">
        <div>
          <span className="eyebrow">{t('multiplayer.presenterMode')}</span>
          <h1>{t('multiplayer.questionLabel', { current: questionIndex + 1, total: totalQuestions })}</h1>
        </div>
        <div className="presenter-room-code">
          <span>{t('multiplayer.roomCode')}</span>
          <strong>{room.code}</strong>
        </div>
      </header>

      <div className="presenter-main-grid">
        <PlantPanel state={plantState} />
        <div className="presenter-side-panel">
          <section className="presenter-question" aria-live="polite">
            <span className="eyebrow">{t(scenario.kickerKey)}</span>
            <h2>{t(scenario.titleKey)}</h2>
            <p className="presenter-narrative">{t(scenario.narrativeKey)}</p>
            <p className="presenter-question-copy">{t(scenario.questionKey)}</p>
            <div className="presenter-choices">
              {scenario.choices.map((choice) => (
                <div
                  className={`presenter-choice${answerRevealed && choice.recommended ? ' correct' : ''}`}
                  key={choice.id}>
                  <span>{choice.id.toUpperCase()}</span>
                  <p>{t(choice.labelKey)}</p>
                  {answerRevealed && choice.recommended && (
                    <strong className="presenter-choice-badge">{t('multiplayer.correctAnswer')}</strong>
                  )}
                </div>
              ))}
              {answerRevealed && correctChoice && (
                <div className="presenter-answer-review" role="status">
                  <span className="eyebrow">{t('multiplayer.explanation')}</span>
                  <p>{t(scenario.insightKey)}</p>
                </div>
              )}
            </div>
          </section>

          <aside className="presenter-progress">
            <div>
              <span>{t('multiplayer.connectedParticipants')}</span>
              <strong>{room.participants.filter(({ connected }) => connected).length}</strong>
            </div>
            <div>
              <span>{t('multiplayer.answersReceived')}</span>
              <strong>
                {answeredParticipants}/{room.participants.length}
              </strong>
            </div>
          </aside>
        </div>
      </div>

      <footer className="presenter-dashboard-actions">
        <button
          type="button"
          className="presenter-reveal-button"
          disabled={!allParticipantsAnswered || answerRevealed || loading}
          onClick={() => setAnswerRevealed(true)}>
          {answerRevealed ? t('multiplayer.answerRevealed') : t('multiplayer.revealAnswer')}
        </button>
        <PrimaryButton
          disabled={isLastQuestion || !allParticipantsAnswered || !answerRevealed}
          loading={loading}
          loadingLabel={t('multiplayer.connecting')}
          onClick={onAdvance}>
          {t('multiplayer.nextQuestion')}
        </PrimaryButton>
        <button type="button" className="text-btn" disabled={loading} onClick={onFinish}>
          {t('multiplayer.finish')}
        </button>
      </footer>
      {!isLastQuestion && !allParticipantsAnswered && (
        <p className="presenter-waiting" role="status">
          {t('multiplayer.waitingForAnswers', { answered: answeredParticipants, total: room.participants.length })}
        </p>
      )}
      {error && (
        <p className="multiplayer-error">{t(`multiplayer.errors.${error}` as never, { defaultValue: error })}</p>
      )}
    </main>
  )
}
