import { useTranslation } from 'react-i18next'
import type { GameState } from '../../types'
import { Plant } from '../plant/Plant'

export function PlantPanel({ state }: { state: GameState }) {
  const { t } = useTranslation()

  return (
    <section className="plant-column">
      <div className="section-tag ot-mono-label">
        <span className="pulse-dot" /> {t('common.plantTwin')}{' '}
        <span className="tag-right">{t('common.simulatedEducational')}</span>
      </div>
      <div className="plant-frame ot-panel-surface">
        <Plant state={state} />
      </div>
      <div className="plant-caption">
        <span>
          <i className="legend-dot green" /> {t('common.operating')}
        </span>
        <span>
          <i className="legend-dot yellow" /> {t('common.monitoring')}
        </span>
        <span>
          <i className="legend-dot red" /> {t('common.compromised')}
        </span>
      </div>
    </section>
  )
}
