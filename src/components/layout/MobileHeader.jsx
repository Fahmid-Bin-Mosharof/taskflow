import { Link } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import Logo from '../common/Logo'
import Avatar from '../common/Avatar'
import ThemeToggle from '../common/ThemeToggle'
import { useAuth } from '../../hooks/useAuth'
import { getDisplayName } from '../../utils/userUtils'

export default function MobileHeader({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <FiMenu size={24} />
        </button>
        <Logo />
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Link to="/dashboard/profile" aria-label="Go to profile" className="rounded-full">
          <Avatar name={getDisplayName(user)} photoURL={user?.photoURL} size="sm" />
        </Link>
      </div>
    </header>
  )
}