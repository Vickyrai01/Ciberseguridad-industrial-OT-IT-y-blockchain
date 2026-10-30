import { HTTP_STATUS } from './constants.ts'

export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status = HTTP_STATUS.BAD_REQUEST,
  ) {
    super(code)
    this.name = 'AppError'
  }
}

export function asAppError(error: unknown): AppError {
  if (error instanceof AppError) return error
  return new AppError(error instanceof Error ? error.message : 'INTERNAL_ERROR', HTTP_STATUS.INTERNAL_ERROR)
}
