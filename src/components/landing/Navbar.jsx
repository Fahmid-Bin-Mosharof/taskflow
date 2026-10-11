import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import Logo from '../common/Logo'
import Button from '../common/Button'
import ThemeToggle from '../common/ThemeToggle'
import { useAuth } from '../../hooks/useAuth'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
]

/** Shows Dashboard + Logout when logged in, Login + Register otherwise. */
function AuthActions({ fullWidth = false, onAction }) {
  const { user, loading, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  // Render nothing while Firebase checks the session, to avoid a flash of the wrong buttons.
  if (loading) return null

  if (user) {
    const handleLogout = async () => {
      setLoggingOut(true)
      try {
        await logout()
        toast.success('Logout successful')
        onAction?.()
      } catch {
        toast.error('Could not log out. Please try again.')
      } finally {
        setLoggingOut(false)
      }
    }

    return (
      <>
        <Button to="/dashboard" fullWidth={fullWidth} onClick={onAction}>
          Dashboard
        </Button>
        <Button
          variant="secondary"
          fullWidth={fullWidth}
          loading={loggingOut}
          onClick={handleLogout}
        >
          {!loggingOut && <FiLogOut size={16} aria-hidden="true" />}
          Logout
        </Button>
      </>
    )
  }

  return (
    <>
      <Button
        to="/login"
        variant={fullWidth ? 'secondary' : 'ghost'}
        fullWidth={fullWidth}
        onClick={onAction}
      >
        Login
      </Button>
      <Button to="/register" fullWidth={fullWidth} onClick={onAction}>
        Register
      </Button>
    </>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-primary dark:text-slate-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <AuthActions />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <AuthActions fullWidth onAction={closeMenu} />
          </div>
        </div>
      )}
    </header>
  )
}