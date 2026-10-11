import { FiWifiOff } from 'react-icons/fi'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div
      role="status"
      className="sticky top-16 z-20 flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-center text-sm text-amber-900 lg:top-0 dark:bg-amber-500/20 dark:text-amber-200"
    >
      <FiWifiOff size={16} aria-hidden="true" />
      You&apos;re offline. Changes will sync when you reconnect.
    </div>
  )
}