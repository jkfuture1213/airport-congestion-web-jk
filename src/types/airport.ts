// 인천공항 공공데이터 API 응답의 승객 예고 항목
export interface PassengerItem {
  adate: string           // 표출일자 (YYYYMMDD | '합계')
  atime: string           // 시간대  (HH_HH)
  t1eg1: string           // T1 입국장 동편 A
  t1eg2: string           // T1 입국장 동편 B
  t1eg3: string           // T1 입국장 서편 C
  t1eg4: string           // T1 입국장 서편 D
  t1egsum1: string        // T1 입국장 합계
  t1dg1: string           // T1 출국장 1
  t1dg2: string           // T1 출국장 2
  t1dg3: string           // T1 출국장 3
  t1dg4: string           // T1 출국장 4
  t1dg5: string           // T1 출국장 5
  t1dg6: string           // T1 출국장 6
  t1dgsum1: string        // T1 출국장 합계
  t2eg1: string           // T2 입국장 1
  t2eg2: string           // T2 입국장 2
  t2egsum1: string        // T2 입국장 합계
  t2dg1: string           // T2 출국장 1
  t2dg2: string           // T2 출국장 2
  t2dgsum2: string        // T2 출국장 합계
}

export type Selectdate = '0' | '1'
export type Theme = 'dark' | 'light'
