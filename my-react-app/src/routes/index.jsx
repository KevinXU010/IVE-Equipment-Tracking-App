import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useAuth } from '../hooks/auth'
import { ProtectedRoute } from './ProtectedRoute'

import Dashboard from '@views/Dashboard'
import Login from '@views/Login'
import Guest from '@views/Guest'

const Routes = () => {
  const { token } = useAuth()

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: '/guest',
      element: <Guest />, // Guest component for public routes
    },
  ]

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: '/',
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: '/',
          element: <Dashboard />,
        },
        {
          path: '/logout',
          element: <div>Logout</div>,
        },
      ],
    },
  ]

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: '/login',
      element: <Login />,
    },
  ]

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...routesForNotAuthenticatedOnly,
    ...routesForAuthenticatedOnly,
  ])

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />
}

export default Routes
