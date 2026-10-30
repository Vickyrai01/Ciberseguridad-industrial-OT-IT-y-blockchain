export const SCORE_CONFIG = { basePoints: 800, speedBonus: 200, speedWindowSeconds: 30 } as const
export function calculateCompetitiveScore(isCorrect: boolean, elapsedSeconds: number): number {
  if (!isCorrect) return 0
  const normalized = Math.max(0, Math.min(1, 1 - elapsedSeconds / SCORE_CONFIG.speedWindowSeconds))
  return SCORE_CONFIG.basePoints + Math.round(SCORE_CONFIG.speedBonus * normalized)
}
