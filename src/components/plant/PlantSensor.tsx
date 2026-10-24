import { useTranslation } from 'react-i18next'

export function PlantSensor() {
  const { t } = useTranslation()

  return (
    <g className="sensor-lines">
      <path d="M800 290 V225 H860" />
      <circle cx="860" cy="225" r="8" />
      <text x="835" y="210">
        {t('plant.sensor')}
      </text>
    </g>
  )
}
