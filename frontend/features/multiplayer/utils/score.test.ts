import { describe, expect, it } from 'vitest'
import { calculateCompetitiveScore } from './score'

describe('competitive score', () => {
  it('awards the configured maximum for an immediate correct answer', () =>
    expect(calculateCompetitiveScore(true, 0)).toBe(1000))
  it('removes the speed bonus after the configured window', () => expect(calculateCompetitiveScore(true, 30)).toBe(800))
  it('never awards points for an incorrect answer', () => expect(calculateCompetitiveScore(false, 0)).toBe(0))
  it('clamps negative time to the maximum', () => expect(calculateCompetitiveScore(true, -5)).toBe(1000))
})
