import { useTranslation } from 'react-i18next'

export function PlantHeader() {
  const { t } = useTranslation()

  return (
    <>
      <div className="ot-plant-zone-label left-[3%]">
        {t('plant.itZone')} <span className="ot-plant-zone-detail">{t('plant.trustLevel')}</span>
      </div>
      <div className="ot-plant-zone-label right-[28%]">
        {t('plant.otZone')} <span className="ot-plant-zone-detail">{t('plant.processControl')}</span>
      </div>
      <div className="ot-plant-zone-label right-[3%] text-ot-yellow">
        {t('plant.safety')} <span className="ot-plant-zone-detail">{t('plant.isolatedLayer')}</span>
      </div>
    </>
  )
}
