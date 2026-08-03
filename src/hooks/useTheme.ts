import { useState, useEffect } from 'react'
import type { Theme } from '../types/airport'

/**
 * 다크/라이트 테마 상태를 관리합니다.
 * - localStorage에 선택 저장 및 복원
 * - 저장된 값이 없으면 시스템 기본값(prefers-color-scheme) 사용
 * - document.documentElement의 data-theme 속성 자동 동기화
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggle }
}
