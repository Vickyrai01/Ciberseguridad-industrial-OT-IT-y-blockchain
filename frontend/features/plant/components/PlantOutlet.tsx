import { useTranslation } from 'react-i18next'

export function PlantOutlet() {
  const { t } = useTranslation()

  return (
    <g aria-label={t('plant.outlet')}>
      <path d="M797 352 H835 V322 H860" className="process-pipe" />
      <circle cx="835" cy="352" r="9" className="process-valve" />
      <path d="M829 346 L841 358 M841 346 L829 358" className="process-valve-mark" />
      <text x="817" y="332" className="process-tag">
        {t('plant.outlet')}
      </text>
    </g>
  )
}
