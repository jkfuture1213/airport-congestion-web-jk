import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { Theme } from '../types/airport'
import { getChartTheme, getDataColors } from '../utils/helpers'

// ── 커스텀 툴팁 ───────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p className="tt-label">{label}시</p>
      {payload.map((p) => (
        <p key={p.name} className="tt-row" style={{ color: p.color }}>
          <span>{p.name}</span>
          <span>{p.value.toLocaleString()}명</span>
        </p>
      ))}
    </div>
  )
}

// ── 추세 차트 데이터 타입 ─────────────────────────────────────────────────────
export interface TrendDataPoint {
  time: string
  'T1 입국': number
  'T1 출국': number
  'T2 입국': number
  'T2 출국': number
}

interface TrendChartProps {
  data: TrendDataPoint[]
  selectedLabel: string | null   // 강조 표시할 시간대 라벨 ("HH~HH")
  theme: Theme
}

export function TrendChart({ data, selectedLabel, theme }: TrendChartProps) {
  const CT     = getChartTheme(theme)
  const COLORS = getDataColors(theme)

  return (
    <section className="chart-section">
      <h2 className="section-title">시간대별 혼잡도 추이</h2>
      <div className="chart-card">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              {Object.entries(COLORS).map(([k, c]) => (
                <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={c} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={c} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CT.grid} />
            <XAxis
              dataKey="time"
              tick={{ fill: CT.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: CT.grid }}
            />
            <YAxis
              tick={{ fill: CT.tick, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: CT.cursor, strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: CT.tick, paddingTop: 12 }} />

            {selectedLabel && (
              <ReferenceLine
                x={selectedLabel}
                stroke={COLORS.t2Exit}
                strokeWidth={2}
                strokeDasharray="6 3"
                label={{ value: '선택', fill: COLORS.t2Exit, fontSize: 11, position: 'top' }}
              />
            )}

            <Area type="monotone" dataKey="T1 입국" stroke={COLORS.t1Entry} fill="url(#grad-t1Entry)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="T1 출국" stroke={COLORS.t1Exit}  fill="url(#grad-t1Exit)"  strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="T2 입국" stroke={COLORS.t2Entry} fill="url(#grad-t2Entry)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="T2 출국" stroke={COLORS.t2Exit}  fill="url(#grad-t2Exit)"  strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
