import { fmtTime } from '../utils/helpers'

interface DeparturePlannerProps {
  inputDate: string
  inputTime: string
  todayStr: string
  tomorrowStr: string
  isCustomMode: boolean
  dateError: string | null
  currentAtime: string | null   // 현재 선택된 atime (배지 표시용)
  onDateChange: (v: string) => void
  onTimeChange: (v: string) => void
  onSearch: () => void
  onReset: () => void
}

export function DeparturePlanner({
  inputDate, inputTime, todayStr, tomorrowStr,
  isCustomMode, dateError, currentAtime,
  onDateChange, onTimeChange, onSearch, onReset,
}: DeparturePlannerProps) {
  return (
    <section className="departure-panel">
      <h2 className="section-title">✈ 출발 시간 조회</h2>

      <div className="departure-form">
        <div className="input-group">
          <label className="input-label" htmlFor="dep-date">날짜</label>
          <input
            id="dep-date"
            type="date"
            className="dep-input"
            value={inputDate}
            min={todayStr}
            max={tomorrowStr}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="dep-time">시간</label>
          <input
            id="dep-time"
            type="time"
            className="dep-input"
            value={inputTime}
            step={3600}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>

        <div className="departure-actions">
          <button className="btn-primary" onClick={onSearch}>
            이 시간대 혼잡도 보기
          </button>
          {isCustomMode && (
            <button className="btn-secondary" onClick={onReset}>
              현재 시간으로 돌아가기
            </button>
          )}
        </div>
      </div>

      {dateError && <p className="dep-error">⚠ {dateError}</p>}

      {isCustomMode && currentAtime && (
        <div className="dep-badge">
          <span className="dep-badge-icon">🔍</span>
          <span>
            <strong>{inputDate}</strong>&nbsp;
            <strong>{fmtTime(currentAtime)}시</strong> 혼잡도를 보고 있습니다
          </span>
        </div>
      )}
    </section>
  )
}
