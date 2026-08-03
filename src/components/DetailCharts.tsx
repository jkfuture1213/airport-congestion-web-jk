import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { PassengerItem, Theme } from '../types/airport'
import { n, fmtTime, getChartTheme, getDataColors } from '../utils/helpers'

interface DetailChartsProps {
  current: PassengerItem
  theme: Theme
}

export function DetailCharts({ current, theme }: DetailChartsProps) {
  const CT     = getChartTheme(theme)
  const COLORS = getDataColors(theme)

  const tooltipStyle = {
    background: CT.surface,
    border: `1px solid ${CT.border}`,
    borderRadius: 8,
    color: CT.text,
  }

  const gridProps  = { strokeDasharray: '3 3', stroke: CT.grid, vertical: false as const }
  const xAxisProps = { tick: { fill: CT.tick, fontSize: 11 }, tickLine: false as const, axisLine: false as const }
  const yAxisProps = { tick: { fill: CT.tick, fontSize: 11 }, tickLine: false as const, axisLine: false as const }
  const tooltipFmt = (v: unknown) => [`${Number(v ?? 0).toLocaleString()}명`, '인원'] as [string, string]
  const cursorStyle = { fill: 'rgba(128,128,128,0.06)' }

  // ── 총계 비교 데이터 ─────────────────────────────────────────────────────
  const totalData = [
    { name: 'T1 입국 합계', 합계: n(current.t1egsum1), color: COLORS.t1Entry },
    { name: 'T1 출국 합계', 합계: n(current.t1dgsum1), color: COLORS.t1Exit },
    { name: 'T2 입국 합계', 합계: n(current.t2egsum1), color: COLORS.t2Entry },
    { name: 'T2 출국 합계', 합계: n(current.t2dgsum2), color: COLORS.t2Exit },
  ]

  // ── 게이트 개별 데이터 ────────────────────────────────────────────────────
  const t1EntryData = [
    { gate: '동편 A', 인원: n(current.t1eg1) },
    { gate: '동편 B', 인원: n(current.t1eg2) },
    { gate: '서편 C', 인원: n(current.t1eg3) },
    { gate: '서편 D', 인원: n(current.t1eg4) },
  ]

  const t1ExitData = [
    { gate: '출국 1', 인원: n(current.t1dg1) },
    { gate: '출국 2', 인원: n(current.t1dg2) },
    { gate: '출국 3', 인원: n(current.t1dg3) },
    { gate: '출국 4', 인원: n(current.t1dg4) },
    { gate: '출국 5', 인원: n(current.t1dg5) },
    { gate: '출국 6', 인원: n(current.t1dg6) },
  ]

  const t2EntryData = [
    { gate: '입국 1', 인원: n(current.t2eg1) },
    { gate: '입국 2', 인원: n(current.t2eg2) },
  ]

  const t2ExitData = [
    { gate: '출국 1', 인원: n(current.t2dg1) },
    { gate: '출국 2', 인원: n(current.t2dg2) },
  ]

  return (
    <section className="detail-section">
      <h2 className="section-title">🕐 {fmtTime(current.atime)}시 상세 현황</h2>

      {/* 총계 비교 차트 (분리) */}
      <div className="chart-card total-compare-card">
        <h3 className="card-title total-compare-title">
          📊 터미널별 총계 비교
          <span className="card-title-sub">— 출입국장 합계 한눈에 비교</span>
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={totalData} margin={{ top: 8, right: 24, left: 10, bottom: 0 }} barSize={60}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="name" {...xAxisProps} />
            <YAxis {...yAxisProps} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
            <Tooltip
              formatter={(v) => [`${Number(v ?? 0).toLocaleString()}명`, '합계'] as [string, string]}
              contentStyle={tooltipStyle}
              cursor={cursorStyle}
            />
            <Bar dataKey="합계" radius={[6, 6, 0, 0]}>
              {totalData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 게이트 개별 차트 */}
      <p className="detail-sub-title">게이트별 개별 현황 (합계 제외)</p>
      <div className="bar-charts-grid">

        <div className="chart-card">
          <h3 className="card-title" style={{ color: COLORS.t1Entry }}>🛬 T1 입국장</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={t1EntryData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="gate" {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} cursor={cursorStyle} />
              <Bar dataKey="인원" fill={COLORS.t1Entry} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="card-title" style={{ color: COLORS.t1Exit }}>🛫 T1 출국장</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={t1ExitData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="gate" {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} cursor={cursorStyle} />
              <Bar dataKey="인원" fill={COLORS.t1Exit} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="card-title" style={{ color: COLORS.t2Entry }}>🛬 T2 입국장</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={t2EntryData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="gate" {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} cursor={cursorStyle} />
              <Bar dataKey="인원" fill={COLORS.t2Entry} radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="card-title" style={{ color: COLORS.t2Exit }}>🛫 T2 출국장</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={t2ExitData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="gate" {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip formatter={tooltipFmt} contentStyle={tooltipStyle} cursor={cursorStyle} />
              <Bar dataKey="인원" fill={COLORS.t2Exit} radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </section>
  )
}
