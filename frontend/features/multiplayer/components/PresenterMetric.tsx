import type { ReactNode } from 'react'

interface PresenterMetricProps {
  label: ReactNode
  value: ReactNode
  className?: string
}

export function PresenterMetric({ label, value, className = '' }: PresenterMetricProps) {
  return (
    <div className={className}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
