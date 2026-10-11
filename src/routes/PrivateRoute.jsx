import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function PrivateRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner fullScreen label="Checking authentication..." />
  }

  if (!user) {
    // Remember where the user was heading so login can send them back.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}