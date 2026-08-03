import type { PassengerItem } from '../types/airport'
import { fmtTime } from '../utils/helpers'

interface TimeSelectorProps {
  items: PassengerItem[]
  selectedTime: string | null
  onSelect: (atime: string) => void
}

export function TimeSelector({ items, selectedTime, onSelect }: TimeSelectorProps) {
  return (
    <section className="time-section">
      <h2 className="section-title">시간대 선택</h2>
      <div className="time-scroll">
        {items.map((item) => (
          <button
            key={item.atime}
            className={`time-chip ${item.atime === selectedTime ? 'active' : ''}`}
            onClick={() => onSelect(item.atime)}
          >
            {fmtTime(item.atime)}
          </button>
        ))}
      </div>
    </section>
  )
}
