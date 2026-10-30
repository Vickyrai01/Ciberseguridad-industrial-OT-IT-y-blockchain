import { AppError } from '../shared/errors.ts'
import {
  CHOICE_IDS,
  ERROR_CODE,
  MULTIPLAYER_CONFIG,
  OPERATION,
  SCENARIO_IDS,
  type Operation,
} from '../shared/constants.ts'

export function requiredString(body: Record<string, unknown>, field: string): string {
  const value = body[field]
  if (typeof value !== 'string' || value.trim() === '') throw new AppError(`MISSING_${field.toUpperCase()}`)
  return value.trim()
}

export function parseOperation(body: Record<string, unknown>): Operation {
  const value = requiredString(body, 'operation')
  if (!Object.values(OPERATION).includes(value as Operation)) throw new AppError(ERROR_CODE.UNKNOWN_OPERATION)
  return value as Operation
}

export function scenarioId(body: Record<string, unknown>): number {
  const value = Number(body.scenarioId)
  if (!Number.isInteger(value) || !SCENARIO_IDS.includes(value as (typeof SCENARIO_IDS)[number]))
    throw new AppError('INVALID_SCENARIO')
  return value
}

export function validateNickname(value: string): { nickname: string; normalized: string } {
  const nickname = value.trim()
  if (
    nickname.length < MULTIPLAYER_CONFIG.minNicknameLength ||
    nickname.length > MULTIPLAYER_CONFIG.maxNicknameLength ||
    [...nickname].some((character) => character.charCodeAt(0) < 32)
  )
    throw new AppError('INVALID_NICKNAME')
  return { nickname, normalized: nickname.toLocaleLowerCase() }
}

export function choiceId(body: Record<string, unknown>): string {
  const value = requiredString(body, 'choiceId').toLowerCase()
  if (!CHOICE_IDS.includes(value as (typeof CHOICE_IDS)[number])) throw new AppError('INVALID_CHOICE')
  return value
}
