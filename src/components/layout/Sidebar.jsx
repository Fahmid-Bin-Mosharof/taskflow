import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FiGrid,
  FiFolder,
  FiCheckSquare,
  FiCalendar,
  FiUser,
  FiSettings,
  FiLogOut,
  FiX,
} from 'react-icons/fi'
import Logo from '../common/Logo'
import Avatar from '../common/Avatar'
import { useAuth } from '../../hooks/useAuth'
import { getDisplayName } from '../../utils/userUtils'
import ThemeToggle from '../common/ThemeToggle'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: FiGrid, end: true },
  { label: 'Projects', to: '/dashboard/projects', icon: FiFolder },
  { label: 'My Tasks', to: '/dashboard/tasks', icon: FiCheckSquare },
  { label: 'Calendar', to: '/dashboard/calendar', icon: FiCalendar },
  { label: 'Profile', to: '/dashboard/profile', icon: FiUser },
  { label: 'Settings', to: '/dashboard/settings', icon: FiSettings },
]

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
    ? 'bg-primary/10 text-primary'
    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`

export default function Sidebar({ onNavigate, onClose }) {
  const { user, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const name = getDisplayName(user)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      toast.success('Logout successful')
      // PrivateRoute redirects to /login once the user is cleared.
    } catch {
      toast.error('Could not log out. Please try again.')
      setLoggingOut(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Close menu"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FiX size={22} />
            </button>
          )}
        </div>
      </div>

      <nav aria-label="Dashboard" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate} className={linkClasses}>
            <Icon size={19} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={name} photoURL={user?.photoURL} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <FiLogOut size={19} aria-hidden="true" />
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}