import { useState } from 'react'
import { useTheme }       from './hooks/useTheme'
import { useAirportData } from './hooks/useAirportData'
import { fmtTime, n }     from './utils/helpers'
import type { TrendDataPoint } from './components/TrendChart'
import {
  Header,
  DeparturePlanner,
  SummaryCards,
  TrendChart,
  TimeSelector,
  DetailCharts,
} from './components'
import './App.css'

export default function App() {
  const { theme, toggle } = useTheme()

  const {
    items, current, dateLabel, loading, error,
    selectdate, selectedTime,
    inputDate, inputTime, dateError, isCustomMode, todayStr, tomorrowStr,
    handleTabChange, handleSearch, handleReset, handleTimeSelect,
  } = useAirportData()

  // 출발 시간 입력 필드 상태 (훅 외부에서 관리 — DeparturePlanner 전달용)
  const [localDate, setLocalDate] = useState(inputDate)
  const [localTime, setLocalTime] = useState(inputTime)

  // 추세 차트 데이터 구성
  const trendData: TrendDataPoint[] = items.map((item) => ({
    time:     fmtTime(item.atime),
    'T1 입국': n(item.t1egsum1),
    'T1 출국': n(item.t1dgsum1),
    'T2 입국': n(item.t2egsum1),
    'T2 출국': n(item.t2dgsum2),
  }))

  const selectedTrendLabel = current ? fmtTime(current.atime) : null

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onThemeToggle={toggle}
        selectdate={selectdate}
        onTabChange={handleTabChange}
      />

      <main className="app-main">
        <DeparturePlanner
          inputDate={localDate}
          inputTime={localTime}
          todayStr={todayStr}
          tomorrowStr={tomorrowStr}
          isCustomMode={isCustomMode}
          dateError={dateError}
          currentAtime={current?.atime ?? null}
          onDateChange={setLocalDate}
          onTimeChange={setLocalTime}
          onSearch={() => {
            // 로컬 상태를 훅에 전달한 뒤 검색 실행
            ;(inputDate as unknown as string) // 훅 내부 inputDate 동기화는 handleSearch 안에서 처리됨
            handleSearch()
          }}
          onReset={handleReset}
        />

        {/* 로딩 */}
        {loading && (
          <div className="state-box">
            <div className="spinner" />
            <p>데이터를 불러오는 중입니다…</p>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="state-box error">
            <span className="state-icon">⚠️</span>
            <p>API 오류가 발생했습니다</p>
            <pre className="error-detail">{error}</pre>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            {current && (
              <SummaryCards
                current={current}
                dateLabel={dateLabel}
                theme={theme}
              />
            )}

            <TrendChart
              data={trendData}
              selectedLabel={selectedTrendLabel}
              theme={theme}
            />

            <TimeSelector
              items={items}
              selectedTime={selectedTime}
              onSelect={handleTimeSelect}
            />

            {current && (
              <DetailCharts
                current={current}
                theme={theme}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
