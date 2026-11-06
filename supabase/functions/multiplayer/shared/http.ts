import { AppError, asAppError } from './errors.ts'
import { API_VERSION, HTTP_STATUS } from './constants.ts'

const MAX_BODY_SIZE_BYTES = 32_000

function getAllowedOrigins(): string[] {
  return (Deno.env.get('MULTIPLAYER_ALLOWED_ORIGINS') ?? '*')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin')
  const allowedOrigins = getAllowedOrigins()
  const allowAnyOrigin = allowedOrigins.includes('*')
  const allowedOrigin =
    origin && (allowAnyOrigin || allowedOrigins.includes(origin)) ? origin : allowAnyOrigin ? '*' : ''
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
    'Content-Type': 'application/json',
  }
}

function json(body: unknown, request: Request, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: getCorsHeaders(request) })
}

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_SIZE_BYTES) throw new AppError('REQUEST_TOO_LARGE', HTTP_STATUS.BAD_REQUEST)
  const text = await request.text()
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_SIZE_BYTES)
    throw new AppError('REQUEST_TOO_LARGE', HTTP_STATUS.BAD_REQUEST)
  if (!text) throw new AppError('INVALID_JSON', HTTP_STATUS.BAD_REQUEST)
  let value: unknown
  try {
    value = JSON.parse(text) as unknown
  } catch {
    throw new AppError('INVALID_JSON', HTTP_STATUS.BAD_REQUEST)
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new AppError('INVALID_REQUEST_BODY', HTTP_STATUS.BAD_REQUEST)
  return value as Record<string, unknown>
}

export type OperationHandler = (body: Record<string, unknown>) => Promise<unknown>

export async function handleHttpRequest(request: Request, handler: OperationHandler): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: getCorsHeaders(request) })
  if (request.method !== 'POST')
    return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'METHOD_NOT_ALLOWED' } }, request, 405)
  try {
    const body = await readJsonBody(request)
    if (body.version !== API_VERSION) throw new AppError('UNSUPPORTED_API_VERSION', HTTP_STATUS.BAD_REQUEST)
    return json(await handler(body), request)
  } catch (error) {
    const appError = asAppError(error)
    if (!(error instanceof AppError)) console.error('Unhandled multiplayer error', error)
    return json({ error: { code: appError.code, message: appError.message } }, request, appError.status)
  }
}
