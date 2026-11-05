import { describe, expect, it } from 'vitest'
import { isCorrectChoice } from '../../../shared/quiz/scenarioAnswerKey'

describe('scenario answer key', () => {
  it('keeps the authoritative answer for every scenario', () => {
    expect([1, 2, 3, 4].every((scenarioId) => isCorrectChoice(scenarioId, 'b'))).toBe(true)
    expect(isCorrectChoice(5, 'c')).toBe(true)
  })

  it('rejects incorrect choices', () => {
    expect(isCorrectChoice(1, 'a')).toBe(false)
    expect(isCorrectChoice(5, 'b')).toBe(false)
  })
})
