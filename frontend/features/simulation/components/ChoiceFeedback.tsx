import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Choice } from '../../../types'

export function ChoiceFeedback({ choice }: { choice: Choice }) {
  const { t } = useTranslation()
  const isRecommended = choice.recommended

  return (
    <div className={`feedback ${isRecommended ? 'good' : 'warn'}`}>
      <div className="feedback-icon">{isRecommended ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}</div>
      <div>
        <strong>{isRecommended ? t('common.recommended') : t('common.consequenceDetected')}</strong>
        <p>{t(choice.consequenceKey)}</p>
      </div>
    </div>
  )
}
