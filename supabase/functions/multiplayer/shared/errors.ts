import { HTTP_STATUS } from './constants.ts'

type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]

export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: HttpStatus = HTTP_STATUS.BAD_REQUEST,
  ) {
    super(code)
    this.name = 'AppError'
  }
}

export function asAppError(error: unknown): AppError {
  if (error instanceof AppError) return error
  return new AppError('INTERNAL_ERROR', HTTP_STATUS.INTERNAL_ERROR)
}
