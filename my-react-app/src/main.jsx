import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from '@hooks/auth'
import Routes from './routes'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </StrictMode>
)
