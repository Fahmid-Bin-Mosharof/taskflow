import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function PublicRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading..." />
  }

  if (user) {
    const destination = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}