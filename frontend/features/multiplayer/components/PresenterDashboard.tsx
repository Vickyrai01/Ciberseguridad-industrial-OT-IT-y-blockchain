import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { scenarios } from '../../simulation/data/scenarios'
import type { RoomSnapshot } from '../types'

interface PresenterDashboardProps {
  room: RoomSnapshot
  onFinish: () => void
}

export function PresenterDashboard({ room, onFinish }: PresenterDashboardProps) {
  const { t } = useTranslation()
  const [questionIndex, setQuestionIndex] = useState(0)
  const totalQuestions = room.scenarioOrder.length
  const scenario = useMemo(
    () => scenarios.find(({ id }) => id === room.scenarioOrder[questionIndex]) ?? scenarios[0],
    [questionIndex, room.scenarioOrder],
  )
  const answeredParticipants = room.leaderboard.filter(
    ({ completedQuestions }) => completedQuestions > questionIndex,
  ).length
  const isLastQuestion = questionIndex === totalQuestions - 1

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

      <section className="presenter-question" aria-live="polite">
        <span className="eyebrow">{t(scenario.kickerKey)}</span>
        <h2>{t(scenario.titleKey)}</h2>
        <p className="presenter-narrative">{t(scenario.narrativeKey)}</p>
        <p className="presenter-question-copy">{t(scenario.questionKey)}</p>
        <div className="presenter-choices">
          {scenario.choices.map((choice) => (
            <div className="presenter-choice" key={choice.id}>
              <span>{choice.id.toUpperCase()}</span>
              <p>{t(choice.labelKey)}</p>
            </div>
          ))}
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

      <footer className="presenter-dashboard-actions">
        <button
          type="button"
          className="text-btn"
          disabled={questionIndex === 0}
          onClick={() => setQuestionIndex((current) => Math.max(0, current - 1))}>
          {t('multiplayer.previousQuestion')}
        </button>
        <button
          type="button"
          className="primary-btn"
          disabled={isLastQuestion}
          onClick={() => setQuestionIndex((current) => Math.min(totalQuestions - 1, current + 1))}>
          {t('multiplayer.nextQuestion')}
        </button>
        <button type="button" className="text-btn" onClick={onFinish}>
          {t('multiplayer.finish')}
        </button>
      </footer>
    </main>
  )
}
