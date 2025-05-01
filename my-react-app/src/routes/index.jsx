import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/auth'
import ProtectedRoute from './ProtectedRoute'
import Layout from '@components/Layout'
import Dashboard from '@views/Dashboard'
import Login from '@views/Login'
import Guest from '@views/Guest'

const Routes = () => {
  const { token } = useAuth()

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          // 访问根路径时重定向到 /dashboard
          path: '/',
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: '/guest',
          element: <Guest />,
        },
        {
          path: '/login',
          element: token ? <Navigate to="/dashboard" replace /> : <Login />,
        },
        {
          path: '/',
          element: <ProtectedRoute />,
          children: [
            {
              path: '/dashboard',
              element: <Dashboard />,
            },
            {
              path: '/logout',
              element: <div>Logout</div>,
            },
          ],
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default Routes
