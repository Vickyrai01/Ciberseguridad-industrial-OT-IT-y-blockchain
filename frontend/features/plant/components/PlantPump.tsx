import { useTranslation } from 'react-i18next'

export function PlantPump() {
  const { t } = useTranslation()

  return (
    <g className="plant-pump" role="group" aria-label={t('plant.pump')}>
      <path d="M670 293 V302 H705" className="pump-shaft" />
      <circle cx="670" cy="275" r="18" className="pump-housing" />
      <circle cx="670" cy="275" r="6" className="pump-light" />
      <path d="M663 275 L670 268 L677 275 L670 282 Z" className="pump-symbol" />
      <text x="653" y="250" className="process-tag">
        {t('plant.pump')}
      </text>
    </g>
  )
}
