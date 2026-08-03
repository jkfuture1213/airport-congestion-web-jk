import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import './App.css'

// ── 환경변수 ──────────────────────────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_API_KEY

// ── 타입 정의 ─────────────────────────────────────────────────────────────────
interface PassengerItem {
  adate: string
  atime: string
  t1eg1: string; t1eg2: string; t1eg3: string; t1eg4: string
  t1egsum1: string
  t1dg1: string; t1dg2: string; t1dg3: string; t1dg4: string; t1dg5: string; t1dg6: string
  t1dgsum1: string
  t2eg1: string; t2eg2: string
  t2egsum1: string
  t2dg1: string; t2dg2: string
  t2dgsum2: string
}

// ── API 호출 ──────────────────────────────────────────────────────────────────
async function fetchAirportData(selectdate: '0' | '1' = '0'): Promise<PassengerItem[]> {
  const params = new URLSearchParams({ numOfRows: '100', pageNo: '1', type: 'json', selectdate })
  const url = `/airport-congestion-web/B551177/passgrAnncmt/getPassgrAnncmt?serviceKey=${API_KEY}&${params}`
  const response = await fetch(url)
  const text = await response.text()
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  let json: unknown
  try { json = JSON.parse(text) } catch { throw new Error(`파싱 실패:\n${text.slice(0, 300)}`) }
  const j = json as Record<string, Record<string, Record<string, unknown>>>
  const raw = (j?.response?.body?.items ?? j?.body?.items ?? []) as PassengerItem[]
  const arr = Array.isArray(raw) ? raw : [raw]
  return arr.filter((i) => i.adate !== '합계')
}

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────
const n = (v: string) => Math.round(parseFloat(v) || 0)
const fmtTime = (t: string) => t.replace('_', '~')
const fmtDate = (d: string) => `${d.slice(0,4)}.${d.slice(4,6)}.${d.slice(6,8)}`

// 커스텀 툴팁
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

// ── 메인 ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [items, setItems] = useState<PassengerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectdate, setSelectdate] = useState<'0' | '1'>('0')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true); setError(null)
    fetchAirportData(selectdate)
      .then((data) => { setItems(data); if (data.length) setSelectedTime(data[0].atime) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [selectdate])

  const current = items.find((i) => i.atime === selectedTime) ?? items[0]
  const dateLabel = items[0] ? fmtDate(items[0].adate) : ''

  // ── 추세 차트 데이터 (시간대별 합계) ──────────────────────────────────────
  const trendData = items.map((i) => ({
    time: fmtTime(i.atime),
    'T1 입국': n(i.t1egsum1),
    'T1 출국': n(i.t1dgsum1),
    'T2 입국': n(i.t2egsum1),
    'T2 출국': n(i.t2dgsum2),
  }))

  // ── 선택 시간대 상세 바 차트 데이터 ──────────────────────────────────────
  const t1EntryData = current ? [
    { gate: '동편 A', 인원: n(current.t1eg1) },
    { gate: '동편 B', 인원: n(current.t1eg2) },
    { gate: '서편 C', 인원: n(current.t1eg3) },
    { gate: '서편 D', 인원: n(current.t1eg4) },
  ] : []

  const t1ExitData = current ? [
    { gate: '출국 1', 인원: n(current.t1dg1) },
    { gate: '출국 2', 인원: n(current.t1dg2) },
    { gate: '출국 3', 인원: n(current.t1dg3) },
    { gate: '출국 4', 인원: n(current.t1dg4) },
    { gate: '출국 5', 인원: n(current.t1dg5) },
    { gate: '출국 6', 인원: n(current.t1dg6) },
  ] : []

  const t2EntryData = current ? [
    { gate: '입국 1', 인원: n(current.t2eg1) },
    { gate: '입국 2', 인원: n(current.t2eg2) },
  ] : []

  const t2ExitData = current ? [
    { gate: '출국 1', 인원: n(current.t2dg1) },
    { gate: '출국 2', 인원: n(current.t2dg2) },
  ] : []

  const COLORS = {
    t1Entry: '#58a6ff',
    t1Exit:  '#3fb950',
    t2Entry: '#bc8cff',
    t2Exit:  '#f9b94e',
  }

  return (
    <div className="app-shell">
      {/* ── 헤더 ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-left">
            <span className="header-icon">✈</span>
            <div>
              <h1 className="header-title">인천공항 혼잡도</h1>
              <p className="header-sub">승객 예고 · 출입국장별 현황</p>
            </div>
          </div>
          <div className="header-tabs">
            <button className={`tab-btn ${selectdate === '0' ? 'active' : ''}`} onClick={() => setSelectdate('0')}>오늘</button>
            <button className={`tab-btn ${selectdate === '1' ? 'active' : ''}`} onClick={() => setSelectdate('1')}>내일</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* ── 로딩 ── */}
        {loading && (
          <div className="state-box">
            <div className="spinner" />
            <p>데이터를 불러오는 중입니다…</p>
          </div>
        )}

        {/* ── 에러 ── */}
        {error && (
          <div className="state-box error">
            <span className="state-icon">⚠️</span>
            <p>API 오류가 발생했습니다</p>
            <pre className="error-detail">{error}</pre>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            {/* ── 날짜 & 요약 카드 ── */}
            <section className="summary-section">
              <p className="summary-date">📅 {dateLabel}</p>
              {current && (
                <div className="summary-grid">
                  {[
                    { label: 'T1 입국 합계', value: n(current.t1egsum1), color: COLORS.t1Entry },
                    { label: 'T1 출국 합계', value: n(current.t1dgsum1), color: COLORS.t1Exit },
                    { label: 'T2 입국 합계', value: n(current.t2egsum1), color: COLORS.t2Entry },
                    { label: 'T2 출국 합계', value: n(current.t2dgsum2), color: COLORS.t2Exit },
                  ].map((c) => (
                    <div key={c.label} className="summary-card" style={{ '--card-accent': c.color } as React.CSSProperties}>
                      <span className="summary-label">{c.label}</span>
                      <span className="summary-value" style={{ color: c.color }}>
                        {c.value.toLocaleString()}<small>명</small>
                      </span>
                      <span className="summary-time">{fmtTime(current.atime)}시</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── 추세 차트 ── */}
            <section className="chart-section">
              <h2 className="section-title">시간대별 혼잡도 추이</h2>
              <div className="chart-card">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      {Object.entries(COLORS).map(([k, c]) => (
                        <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={c} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={c} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="time" tick={{ fill: '#8b949e', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#30363d' }} />
                    <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#58a6ff', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#8b949e', paddingTop: 12 }} />
                    <Area type="monotone" dataKey="T1 입국" stroke={COLORS.t1Entry} fill={`url(#grad-t1Entry)`} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Area type="monotone" dataKey="T1 출국" stroke={COLORS.t1Exit}  fill={`url(#grad-t1Exit)`}  strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Area type="monotone" dataKey="T2 입국" stroke={COLORS.t2Entry} fill={`url(#grad-t2Entry)`} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Area type="monotone" dataKey="T2 출국" stroke={COLORS.t2Exit}  fill={`url(#grad-t2Exit)`}  strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* ── 시간대 선택 ── */}
            <section className="time-section">
              <h2 className="section-title">시간대 선택</h2>
              <div className="time-scroll">
                {items.map((item) => (
                  <button
                    key={item.atime}
                    className={`time-chip ${item.atime === selectedTime ? 'active' : ''}`}
                    onClick={() => setSelectedTime(item.atime)}
                  >
                    {fmtTime(item.atime)}
                  </button>
                ))}
              </div>
            </section>

            {/* ── 게이트별 상세 바 차트 ── */}
            {current && (
              <section className="detail-section">
                <h2 className="section-title">🕐 {fmtTime(current.atime)}시 게이트별 상세</h2>
                <div className="bar-charts-grid">
                  {/* T1 입국 */}
                  <div className="chart-card">
                    <h3 className="card-title" style={{ color: COLORS.t1Entry }}>🛬 T1 입국장</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={t1EntryData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                        <XAxis dataKey="gate" tick={{ fill: '#8b949e', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip formatter={(v) => [`${Number(v ?? 0).toLocaleString()}명`, '인원']} contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3' }} cursor={{ fill: 'rgba(88,166,255,0.06)' }} />
                        <Bar dataKey="인원" fill={COLORS.t1Entry} radius={[4, 4, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* T1 출국 */}
                  <div className="chart-card">
                    <h3 className="card-title" style={{ color: COLORS.t1Exit }}>🛫 T1 출국장</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={t1ExitData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                        <XAxis dataKey="gate" tick={{ fill: '#8b949e', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip formatter={(v) => [`${Number(v ?? 0).toLocaleString()}명`, '인원']} contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3' }} cursor={{ fill: 'rgba(63,185,80,0.06)' }} />
                        <Bar dataKey="인원" fill={COLORS.t1Exit} radius={[4, 4, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* T2 입국 */}
                  <div className="chart-card">
                    <h3 className="card-title" style={{ color: COLORS.t2Entry }}>🛬 T2 입국장</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={t2EntryData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                        <XAxis dataKey="gate" tick={{ fill: '#8b949e', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip formatter={(v) => [`${Number(v ?? 0).toLocaleString()}명`, '인원']} contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3' }} cursor={{ fill: 'rgba(188,140,255,0.06)' }} />
                        <Bar dataKey="인원" fill={COLORS.t2Entry} radius={[4, 4, 0, 0]} maxBarSize={60} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* T2 출국 */}
                  <div className="chart-card">
                    <h3 className="card-title" style={{ color: COLORS.t2Exit }}>🛫 T2 출국장</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={t2ExitData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                        <XAxis dataKey="gate" tick={{ fill: '#8b949e', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip formatter={(v) => [`${Number(v ?? 0).toLocaleString()}명`, '인원']} contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3' }} cursor={{ fill: 'rgba(249,185,78,0.06)' }} />
                        <Bar dataKey="인원" fill={COLORS.t2Exit} radius={[4, 4, 0, 0]} maxBarSize={60} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
