import type { Theme, Selectdate } from '../types/airport'

interface HeaderProps {
  theme: Theme
  onThemeToggle: () => void
  selectdate: Selectdate
  onTabChange: (sd: Selectdate) => void
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export function Header({ theme, onThemeToggle, selectdate, onTabChange }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* 로고 */}
        <div className="header-left">
          <span className="header-icon">✈</span>
          <div>
            <h1 className="header-title">인천공항 혼잡도</h1>
            <p className="header-sub">승객 예고 · 출입국장별 현황</p>
          </div>
        </div>

        {/* 우측 컨트롤 */}
        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={onThemeToggle}
            aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            <span className="theme-toggle-label">{theme === 'dark' ? '라이트' : '다크'}</span>
          </button>

          <div className="header-tabs">
            <button
              className={`tab-btn ${selectdate === '0' ? 'active' : ''}`}
              onClick={() => onTabChange('0')}
            >오늘</button>
            <button
              className={`tab-btn ${selectdate === '1' ? 'active' : ''}`}
              onClick={() => onTabChange('1')}
            >내일</button>
          </div>
        </div>
      </div>
    </header>
  )
}
