import { useTranslation } from 'react-i18next'

export function PlantProcess() {
  const { t } = useTranslation()

  return (
    <g className="process">
      <defs>
        <clipPath id="tank-liquid-clip">
          <rect x="710" y="290" width="84" height="96" rx="12" />
        </clipPath>
      </defs>
      <rect x="705" y="285" width="92" height="107" rx="16" fill="url(#tank)" stroke="#4e7074" />
      <g clipPath="url(#tank-liquid-clip)">
        <rect x="706" y="340" width="92" height="48" fill="#246f6b" className="liquid-fill" />
        <path d="M696 340 Q716 332 736 340 T776 340 T816 340 V390 H696Z" fill="#31958c" className="liquid-wave" />
        <path
          d="M696 347 Q716 340 736 347 T776 347 T816 347"
          fill="none"
          stroke="#70d7c1"
          strokeOpacity=".45"
          strokeWidth="2"
          className="liquid-wave liquid-wave-highlight"
        />
      </g>
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
