import type { PassengerItem, Theme } from '../types/airport'
import { n, fmtTime, getDataColors } from '../utils/helpers'

interface SummaryCardsProps {
  current: PassengerItem
  dateLabel: string
  theme: Theme
}

export function SummaryCards({ current, dateLabel, theme }: SummaryCardsProps) {
  const COLORS = getDataColors(theme)

  const cards = [
    { label: 'T1 입국 합계', value: n(current.t1egsum1), color: COLORS.t1Entry },
    { label: 'T1 출국 합계', value: n(current.t1dgsum1), color: COLORS.t1Exit },
    { label: 'T2 입국 합계', value: n(current.t2egsum1), color: COLORS.t2Entry },
    { label: 'T2 출국 합계', value: n(current.t2dgsum2), color: COLORS.t2Exit },
  ]

  return (
    <section className="summary-section">
      <p className="summary-date">📅 {dateLabel}</p>
      <div className="summary-grid">
        {cards.map((c) => (
          <div
            key={c.label}
            className="summary-card"
            style={{ '--card-accent': c.color } as React.CSSProperties}
          >
            <span className="summary-label">{c.label}</span>
            <span className="summary-value" style={{ color: c.color }}>
              {c.value.toLocaleString()}<small>명</small>
            </span>
            <span className="summary-time">{fmtTime(current.atime)}시</span>
          </div>
        ))}
      </div>
    </section>
  )
}
