import type { Selectdate, Theme } from '../types/airport'

/** 숫자 문자열을 정수로 변환 */
export const n = (v: string): number => Math.round(parseFloat(v) || 0)

/** API atime 형식 "HH_HH" → "HH~HH" 표시용으로 변환 */
export const fmtTime = (t: string): string => t.replace('_', '~')

/** API adate 형식 "YYYYMMDD" → "YYYY.MM.DD" 표시용으로 변환 */
export const fmtDate = (d: string): string =>
  `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`

/** 현재 시각에 해당하는 selectdate와 atime 키를 반환 */
export function getNowSlot(): { selectdate: Selectdate; atime: string } {
  const h = new Date().getHours()
  const nextH = (h + 1) % 24
  return {
    selectdate: '0',
    atime: `${String(h).padStart(2, '0')}_${String(nextH).padStart(2, '0')}`,
  }
}

/** "HH:MM" 형식의 시각 문자열을 API atime 키 "HH_HH"로 변환 */
export function toAtimeKey(timeStr: string): string {
  const h = parseInt(timeStr.split(':')[0], 10)
  const nextH = (h + 1) % 24
  return `${String(h).padStart(2, '0')}_${String(nextH).padStart(2, '0')}`
}

/** 날짜 문자열이 오늘('0'), 내일('1')인지 판별 — 그 외는 null */
export function dateToSelectdate(dateStr: string): Selectdate | null {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  if (dateStr === fmt(today)) return '0'
  if (dateStr === fmt(tomorrow)) return '1'
  return null
}

/** 테마에 따라 Recharts 내부 색상 값을 반환 */
export function getChartTheme(theme: Theme) {
  const isDark = theme === 'dark'
  return {
    grid:    isDark ? '#30363d' : '#e2e8f0',
    tick:    isDark ? '#8b949e' : '#64748b',
    surface: isDark ? '#161b22' : '#ffffff',
    border:  isDark ? '#30363d' : '#e2e8f0',
    text:    isDark ? '#e6edf3' : '#1e293b',
    cursor:  isDark ? '#58a6ff' : '#0969da',
  }
}

/** 테마에 따라 데이터 계열 색상 팔레트를 반환 */
export function getDataColors(theme: Theme) {
  return theme === 'dark'
    ? { t1Entry: '#58a6ff', t1Exit: '#3fb950', t2Entry: '#bc8cff', t2Exit: '#f9b94e' }
    : { t1Entry: '#0969da', t1Exit: '#1a7f37', t2Entry: '#8250df', t2Exit: '#bf8700' }
}
