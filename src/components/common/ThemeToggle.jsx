import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../../hooks/useTheme'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${className}`}
    >
      {isDark ? <FiSun size={20} aria-hidden="true" /> : <FiMoon size={20} aria-hidden="true" />}
    </button>
  )
}