import type { PassengerItem, Selectdate } from '../types/airport'

const API_KEY = import.meta.env.VITE_API_KEY

/**
 * 인천공항 승객예고 출·입국장별 데이터를 가져옵니다.
 * @param selectdate '0' = 오늘, '1' = 내일
 */
export async function fetchAirportData(selectdate: Selectdate = '0'): Promise<PassengerItem[]> {
  const params = new URLSearchParams({
    numOfRows: '100',
    pageNo: '1',
    type: 'json',
    selectdate,
  })
  const url = `/airport-congestion-web/B551177/passgrAnncmt/getPassgrAnncmt?serviceKey=${API_KEY}&${params}`

  const response = await fetch(url)
  const text = await response.text()

  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`JSON 파싱 실패:\n${text.slice(0, 300)}`)
  }

  const j = json as Record<string, Record<string, Record<string, unknown>>>
  const raw = (j?.response?.body?.items ?? j?.body?.items ?? []) as PassengerItem[]
  const arr = Array.isArray(raw) ? raw : [raw]

  // '합계' 행 제거 (API 응답 마지막에 합계 행이 포함되는 경우가 있음)
  return arr.filter((item) => item.adate !== '합계')
}
