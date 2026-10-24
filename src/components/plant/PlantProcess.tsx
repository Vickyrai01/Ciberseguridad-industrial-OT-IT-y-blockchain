import { useTranslation } from 'react-i18next'

export function PlantProcess() {
  const { t } = useTranslation()

  return (
    <g className="process">
      <rect x="705" y="285" width="92" height="107" rx="16" fill="url(#tank)" stroke="#4e7074" />
      <path d="M710 340 Q750 325 793 340 V381 H710Z" fill="#2b7d78" className="liquid" />
      <path d="M796 350 H850 V368 H796 M820 350 V308 H850" fill="none" stroke="#4e7074" strokeWidth="9" />
      <circle cx="748" cy="257" r="18" fill="#15242d" stroke="#e4b354" />
      <circle cx="748" cy="257" r="6" fill="#6fe0b0" className="pump-light" />
      <text x="715" y="414">
        {t('plant.tankProcess')}
      </text>
      <text x="715" y="429" className="sensor-read">
        {t('plant.sensorRead')}
      </text>
    </g>
  )
}
