import { MULTIPLAYER_CONFIG } from '../shared/constants.ts'

export async function hashToken(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function createSecret(): string {
  return `${crypto.randomUUID()}-${crypto.randomUUID()}`
}

export function createRoomCode(): string {
  const alphabet = MULTIPLAYER_CONFIG.roomCodeAlphabet
  const bytes = crypto.getRandomValues(new Uint8Array(MULTIPLAYER_CONFIG.roomCodeLength))
  return `${MULTIPLAYER_CONFIG.roomCodePrefix}${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')}`
}
