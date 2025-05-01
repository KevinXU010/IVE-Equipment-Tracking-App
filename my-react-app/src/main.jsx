import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from '@hooks/auth'
import Routes from './routes'
import Layout from '@components/Layout'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Layout>
        <Routes />
      </Layout>
    </AuthProvider>
  </StrictMode>
)
