import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

/**
 * Redirects unauthenticated users to /login.
 * If role is specified, also checks role.
 */
export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="route-loading">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'peserta') return <Navigate to="/peserta/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return children
}

/**
 * Redirects already-authenticated users away from login/register.
 */
export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="route-loading">
        <div className="spinner" />
      </div>
    )
  }

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    return <Navigate to="/peserta/dashboard" replace />
  }

  return children
}
