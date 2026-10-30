import { AppError, asAppError } from './errors.ts'
import { API_VERSION, HTTP_STATUS } from './constants.ts'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Content-Type': 'application/json',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders })
}

export type OperationHandler = (body: Record<string, unknown>) => Promise<unknown>

export async function handleHttpRequest(request: Request, handler: OperationHandler): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const body = (await request.json()) as Record<string, unknown>
    if (body.version !== API_VERSION) throw new AppError('UNSUPPORTED_API_VERSION', HTTP_STATUS.BAD_REQUEST)
    return json(await handler(body))
  } catch (error) {
    const appError = asAppError(error)
    return json({ error: { code: appError.code, message: appError.message } }, appError.status)
  }
}
