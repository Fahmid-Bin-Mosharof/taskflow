import { Suspense, useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import MobileHeader from '../components/layout/MobileHeader'
import OfflineBanner from '../components/layout/OfflineBanner'
import ErrorBoundary from '../components/common/ErrorBoundary'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SkipLink from '../components/common/SkipLink'

const DESKTOP_BREAKPOINT = 1024 // Tailwind "lg"

export default function DashboardLayout() {
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  useEffect(() => {
    if (!drawerOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) setDrawerOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <div className="min-h-screen">
      <SkipLink />

      {/* Desktop sidebar */}
      <aside className="hidden border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 dark:border-slate-800 dark:bg-slate-900">
        <Sidebar />
      </aside>

      {/* Mobile drawer (only mounted while open) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <aside className="relative h-full w-72 max-w-[85%] bg-white shadow-xl dark:bg-slate-900">
            <Sidebar onNavigate={closeDrawer} onClose={closeDrawer} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <MobileHeader onMenuClick={openDrawer} />
        <OfflineBanner />
        <main
          id="main-content"
          tabIndex={-1}
          className="p-4 focus:outline-none sm:p-6 lg:p-8"
        >
          <div className="mx-auto max-w-7xl">
            {/* Keyed by path so a crash on one page clears when you navigate away */}
            <ErrorBoundary key={location.pathname}>
              <Suspense fallback={<LoadingSpinner label="Loading page..." />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}