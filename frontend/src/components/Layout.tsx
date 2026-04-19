import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { IconMoon, IconSun } from './icons'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? ' nav-link--active' : ''}`
const THEME_STORAGE_KEY = 'mandarin-theme'

type ThemeMode = 'light' | 'dark'

/** Root `/` NavLink matching is error-prone in react-router; use Link + pathname. */
function quizNavClass(pathname: string) {
  const active = pathname === '/' || pathname === '/quiz'
  return `nav-link${active ? ' nav-link--active' : ''}`
}

export function Layout() {
  const { pathname } = useLocation()
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return (
    <div className="app-shell">
      <header className="top-bar">
        <Link to="/" className="brand">
          HSK Quiz
        </Link>
        <div className="top-bar-actions">
          <nav className="nav-tabs" aria-label="Main">
            <Link to="/" className={quizNavClass(pathname)}>
              Quiz
            </Link>
            <NavLink to="/review" className={linkClass}>
              Review
            </NavLink>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((curr) => (curr === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <IconSun className="theme-toggle-icon" />
            ) : (
              <IconMoon className="theme-toggle-icon" />
            )}
          </button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
