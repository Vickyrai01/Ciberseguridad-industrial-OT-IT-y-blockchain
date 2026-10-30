import { useTranslation } from 'react-i18next'
import type { LeaderboardEntry } from '../types'

interface MultiplayerLeaderboardProps {
  entries: LeaderboardEntry[]
  currentParticipantId?: string
  floating?: boolean
}

export function MultiplayerLeaderboard({
  entries,
  currentParticipantId,
  floating = false,
}: MultiplayerLeaderboardProps) {
  const { t } = useTranslation()

  return (
    <section className={`multiplayer-leaderboard${floating ? ' floating' : ''}`} aria-live="polite">
      <div className="leaderboard-title">
        <span>{t('multiplayer.leaderboard')}</span>
        <span>{t('multiplayer.live')}</span>
      </div>
      {entries.length === 0 ? (
        <p className="leaderboard-empty">{t('multiplayer.noScores')}</p>
      ) : (
        <div className="leaderboard-list" role="list">
          {entries.map((entry) => {
            const isCurrentParticipant = entry.participantId === currentParticipantId || entry.isCurrentParticipant
            return (
              <div
                className={`leaderboard-row${isCurrentParticipant ? ' current' : ''}`}
                key={entry.participantId}
                role="listitem">
                <span className="leaderboard-position">#{entry.position}</span>
                <span className="leaderboard-name">{entry.nickname}</span>
                <span className="leaderboard-progress">
                  {entry.completedQuestions}/{entry.totalQuestions}
                </span>
                <strong className="leaderboard-score">{entry.score}</strong>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
