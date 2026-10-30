export interface SupabasePublicConfig {
  url: string
  publishableKey: string
}

export function readSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined
  return url && publishableKey ? { url, publishableKey } : null
}
