export interface SupabasePublicConfig {
  url: string
  publishableKey: string
}

function readNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

export function readSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = readNonEmptyString(import.meta.env.VITE_SUPABASE_URL)
  const publishableKey = readNonEmptyString(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
  if (!url || !publishableKey) return null

  try {
    const parsedUrl = new URL(url)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return null
  } catch {
    return null
  }

  return { url, publishableKey }
}
