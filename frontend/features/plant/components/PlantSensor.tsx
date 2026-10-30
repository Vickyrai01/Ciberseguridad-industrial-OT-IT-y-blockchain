import { useTranslation } from 'react-i18next'

export function PlantSensor() {
  const { t } = useTranslation()

  return (
    <g className="sensor-system">
      <path d="M775 292 V275 H800 V225 H840 H808" className="sensor-cable" />
      <path d="M775 292 V327" className="sensor-probe" />
      <circle cx="775" cy="331" r="5" className="sensor-probe-tip" />
      <circle cx="840" cy="225" r="8" className="sensor-node" />
      <text x="805" y="175" className="sensor-label">
        {t('plant.levelSensor')}
      </text>
    </g>
  )
}
