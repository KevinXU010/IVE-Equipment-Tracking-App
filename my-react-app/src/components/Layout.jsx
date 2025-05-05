import React, { useState, useEffect } from 'react'
import Footer from './Footer'
import Header from './Header'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div
      className="font-['Poppins'] min-h-screen bg-cover bg-no-repeat flex flex-col bg-fixed"
      style={{ backgroundImage: `url('/Web_Background.jpg')` }}
    >
      <Header />

      <main className="flex flex-col items-center justify-center flex-1 z-10 text-center gap-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout
