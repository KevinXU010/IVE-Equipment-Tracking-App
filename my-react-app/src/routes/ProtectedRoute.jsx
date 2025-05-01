import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@hooks/auth'

const ProtectedRoute = () => {
  const { token } = useAuth()

  console.log('ProtectedRoute token:', token)

  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the login page
    console.log('redirecting to login page...')
    return <Navigate to="/login" />
  }

  // If authenticated, render the child routes
  return <Outlet />
}

export default ProtectedRoute
