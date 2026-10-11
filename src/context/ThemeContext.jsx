import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

// Keep this key in sync with the inline script in index.html.
const STORAGE_KEY = 'taskflow-theme'

const isTheme = (value) => value === 'light' || value === 'dark'

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null)

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isTheme(stored) ? stored : null
  } catch {
    return null // storage unavailable (e.g. private mode)
  }
}

function getInitialTheme() {
  const stored = readStoredTheme()
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Keep other open tabs in sync.
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && isTheme(e.newValue)) setThemeState(e.newValue)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const setTheme = useCallback((next) => {
    if (!isTheme(next)) return
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore: the theme still applies for this session */
    }
  }, [])

  const toggleTheme = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [theme, setTheme]
  )

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}