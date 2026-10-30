import type { ParticipantSession } from '../../types'

const SESSION_STORAGE_KEY = 'ot-under-attack-multiplayer-session'

export const multiplayerSessionStorage = {
  save: (session: ParticipantSession): void => localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session)),
  load: (): ParticipantSession | null => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY)
      return raw ? (JSON.parse(raw) as ParticipantSession) : null
    } catch {
      return null
    }
  },
  clear: (): void => localStorage.removeItem(SESSION_STORAGE_KEY),
}
