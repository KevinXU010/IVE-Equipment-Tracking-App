import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@hooks/auth'
import Header from '@components/Header'
import './index.css'

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)

  const { user } = useAuth() // Get the user from the auth context

  useEffect(() => {
    fetch('http://localhost:3001/items')
      .then((res) => res.json())
      .then((data) => setItem(data.find((i) => String(i.id) === id)))
      .catch(console.error)
  }, [id])

  // handler to flip Borrowed → true
  const handleBorrow = async () => {
    // confirm before borrowing
    if (!window.confirm('Are you sure you want to borrow this item?')) {
      return
    }

    try {
      await fetch(`http://localhost:3001/items/${id}/borrow`, {
        method: 'POST',
      })
      setItem((prev) => ({ ...prev, Borrowed: 1 }))
      // confirmation after success
      window.alert('Item borrowed successfully!')
    } catch (e) {
      console.error(e)
      window.alert('Failed to borrow. Please try again.')
    }
  }

  // handler to flip Borrowed → false
  const handleReturn = async () => {
    // confirm before returning
    if (!window.confirm('Are you sure you want to return this item?')) {
      return
    }

    try {
      await fetch(`http://localhost:3001/items/${id}/return`, {
        method: 'POST',
      })
      setItem((prev) => ({ ...prev, Borrowed: 0 }))
      // confirmation after success
      window.alert('Item returned successfully!')
    } catch (e) {
      console.error(e)
      window.alert('Failed to return. Please try again.')
    }
  }

  if (!item) {
    return (
      <div
        className="font-['Poppins'] w-screen min-h-screen bg-cover bg-fixed bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('/Web_Background.jpg')" }}
      >
        <span className="text-white text-xl">Loading…</span>
      </div>
    )
  }

  return (
    <div
      className="font-['Poppins'] w-full min-h-screen bg-cover bg-fixed bg-no-repeat flex flex-col"
      style={{ backgroundImage: "url('/Web_Background.jpg')" }}
    >
      <Header />

      <main className="w-full flex flex-col justify-center items-center p-8 space-y-6 text-white">
        <Link
          to="/"
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
        >
          Back
        </Link>

        <h1 className="text-4xl font-bold">{item.name}</h1>

        <div className="flex flex-wrap gap-8">
          <img
            src={item.img}
            alt={item.name}
            className="h-48 rounded-lg shadow-lg"
          />
          {item.qr && (
            <img
              src={item.qr}
              alt="QR Code"
              className="h-48 rounded-lg shadow-lg"
            />
          )}
        </div>

        <div className="space-y-2 text-gray-100">
          <p>
            <strong>ID:</strong> {item.id}
          </p>
          <p>
            <strong>Category:</strong> {item.statement}
          </p>
          <p>
            <strong>Description:</strong> {item.description}
          </p>
          <p>
            <strong>Borrowed:</strong> {item.Borrowed ? 'Yes' : 'No'}
          </p>
        </div>

        {/* Borrow / Return buttons */}
        <div className="flex space-x-4">
          {!item.Borrowed ? (
            <button
              onClick={handleBorrow}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
            >
              Borrow
            </button>
          ) : (
            <button
              onClick={handleReturn}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
            >
              Return
            </button>
          )}

          {user?.admin && (
            <button
              // onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
            >
              Delete
            </button>
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-white">
        © UniSA - IVE Project
      </footer>
    </div>
  )
}
