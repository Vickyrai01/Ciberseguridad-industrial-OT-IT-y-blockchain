import type { ReactNode } from 'react'

interface MetricCardProps {
  label: ReactNode
  value: ReactNode
  suffix?: ReactNode
  tone?: '' | 'green' | 'red' | 'cyan' | 'orange'
  meterValue?: number
}

export function MetricCard({ label, value, suffix, tone = '', meterValue }: MetricCardProps) {
  return (
    <div className="stat">
      <div className="stat-label">
        {label}
        {tone && <span className={`tiny-dot ${tone}`} />}
      </div>
      <div className="stat-value">
        {value}
        <small>{suffix}</small>
      </div>
      {meterValue !== undefined && (
        <div className="meter">
          <span className={tone} style={{ width: `${meterValue}%` }} />
        </div>
      )}
    </div>
  )
}
