import React from 'react'
import { StrictMode } from 'react'  
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ItemDetail from './ItemDetail.jsx'
import AuthProvider from './hooks/auth.jsx'
import './index.css'

// Grab the root DOM node and render our React tree into it
createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/* Wrap the app in AuthProvider so all child components can access auth state */}
        <AuthProvider>
            {/* BrowserRouter enables HTML5 pushState-based routing */}
            <BrowserRouter>
                {/* Routes defines all possible application routes */}
                <Routes>
                    {/* Home page at "/" renders the App component */}
                    <Route path="/" element={<App />} />
                    {/* Detail page at "/items/:id" renders ItemDetail, with `id` available via useParams */}
                    <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
