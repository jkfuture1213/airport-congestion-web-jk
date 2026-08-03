import { useState, useEffect, useCallback } from 'react'
import { fetchAirportData } from '../api/airportApi'
import type { PassengerItem, Selectdate } from '../types/airport'
import { getNowSlot, toAtimeKey, dateToSelectdate, fmtDate } from '../utils/helpers'

interface UseAirportDataReturn {
  // 데이터
  items: PassengerItem[]
  current: PassengerItem | null
  dateLabel: string
  loading: boolean
  error: string | null

  // 탭/날짜 상태
  selectdate: Selectdate
  selectedTime: string | null

  // 출발 시간 입력 상태
  inputDate: string
  inputTime: string
  dateError: string | null
  isCustomMode: boolean
  todayStr: string
  tomorrowStr: string

  // 액션
  handleTabChange: (sd: Selectdate) => void
  handleSearch: () => void
  handleReset: () => void
  handleTimeSelect: (atime: string) => void
}

/**
 * 인천공항 혼잡도 데이터 로딩 및 사용자 인터랙션 상태를 관리합니다.
 * - API 호출, 로딩/에러 상태
 * - 오늘/내일 탭 전환
 * - 출발 시간 선택 (직접 입력 & 칩 클릭)
 * - 현재 시간으로 돌아가기
 */
export function useAirportData(): UseAirportDataReturn {
  const todayStr    = new Date().toISOString().slice(0, 10)
  const tomorrowStr = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  })()
  const nowHH = String(new Date().getHours()).padStart(2, '0')

  const [items, setItems]               = useState<PassengerItem[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [selectdate, setSelectdate]     = useState<Selectdate>('0')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [inputDate, setInputDate]       = useState(todayStr)
  const [inputTime, setInputTime]       = useState(`${nowHH}:00`)
  const [dateError, setDateError]       = useState<string | null>(null)
  const [isCustomMode, setIsCustomMode] = useState(false)

  // ── API 호출 ─────────────────────────────────────────────────────────────
  const loadData = useCallback((sd: Selectdate) => {
    setLoading(true)
    setError(null)
    fetchAirportData(sd)
      .then((data) => {
        setItems(data)
        if (data.length) setSelectedTime(data[0].atime)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadData(selectdate) }, [selectdate, loadData])

  // 탭 변경 후 커스텀 시간 재적용 (날짜가 바뀌어 데이터가 새로 로드됐을 때)
  useEffect(() => {
    if (isCustomMode && items.length > 0) {
      setSelectedTime(toAtimeKey(inputTime))
    }
    // inputTime 변경으로 인한 재실행은 의도적으로 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // ── 액션 ─────────────────────────────────────────────────────────────────
  function handleTabChange(sd: Selectdate) {
    setSelectdate(sd)
    setIsCustomMode(false)
    setInputDate(sd === '0' ? todayStr : tomorrowStr)
  }

  function handleSearch() {
    setDateError(null)
    const sd = dateToSelectdate(inputDate)
    if (sd === null) {
      setDateError('오늘 또는 내일 날짜만 선택할 수 있습니다.')
      return
    }
    if (sd !== selectdate) setSelectdate(sd)
    setSelectedTime(toAtimeKey(inputTime))
    setIsCustomMode(true)
  }

  function handleReset() {
    const { selectdate: sd, atime } = getNowSlot()
    setIsCustomMode(false)
    setDateError(null)
    setInputDate(todayStr)
    setInputTime(`${nowHH}:00`)
    if (sd !== selectdate) setSelectdate(sd)
    else setSelectedTime(atime)
  }

  function handleTimeSelect(atime: string) {
    setSelectedTime(atime)
    setIsCustomMode(false)
  }

  // ── 파생 값 ───────────────────────────────────────────────────────────────
  const current   = items.find((i) => i.atime === selectedTime) ?? null
  const dateLabel = items[0] ? fmtDate(items[0].adate) : ''

  return {
    items, current, dateLabel, loading, error,
    selectdate, selectedTime,
    inputDate, inputTime, dateError, isCustomMode, todayStr, tomorrowStr,
    handleTabChange, handleSearch, handleReset, handleTimeSelect,
  }
}

// ── 출발 시간 입력 상태 별도 노출 (DeparturePlanner 내부 제어용) ──────────────
// inputDate, inputTime 변경은 훅 내부에서 useState로 관리하되
// setter를 직접 노출하는 대신 아래 함수들을 추가로 내보낸다.
// 단, 현재 구조에서는 부모(App)가 상태를 소유하므로 setter를 props로 전달하는 패턴 사용.
