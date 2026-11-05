import { useTranslation } from 'react-i18next'

export function MultiplayerError({ error }: { error: string | null }) {
  const { t } = useTranslation()

  if (!error) return null

  return <p className="multiplayer-error">{t(`multiplayer.errors.${error}` as never, { defaultValue: error })}</p>
}
