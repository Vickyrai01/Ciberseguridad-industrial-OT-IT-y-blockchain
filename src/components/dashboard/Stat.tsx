interface StatProps { label: string; value: number; suffix?: string; tone?: string }

export function Stat({ label, value, suffix, tone }: StatProps) {
  return <div className="stat"><div className="stat-label">{label}<span className={`tiny-dot ${tone || ''}`}/></div><div className="stat-value">{value}<small>{suffix}</small></div><div className="meter"><span className={tone || ''} style={{ width: `${value}%` }}/></div></div>
}
