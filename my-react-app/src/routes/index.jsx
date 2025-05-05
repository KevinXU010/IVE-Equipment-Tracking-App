import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/auth'
import ProtectedRoute from './ProtectedRoute'
import Layout from '@components/Layout'
import Dashboard from '@views/Dashboard'
import Login from '@views/Login'
import Guest from '@views/Guest'
import Scan from '@views/Scan'
import ItemDetail from '@views/ItemDetail'
import Debug from '@views/Debug'

const Routes = () => {
  const { token } = useAuth()

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: '/guest',
          element: <Guest />,
        },
        {
          path: '/scan',
          element: <Scan />,
        },
        {
          path: '/debug',
          element: <Debug />,
        },
        {
          path: '/login',
          element: <Login />,
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
            {
              path: '/items/:id',
              element: <ItemDetail />,
            },
          ],
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default Routes
