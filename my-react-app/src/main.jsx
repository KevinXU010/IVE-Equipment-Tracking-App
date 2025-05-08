import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ItemDetail from './ItemDetail.jsx'
import AuthProvider from './hooks/auth.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
