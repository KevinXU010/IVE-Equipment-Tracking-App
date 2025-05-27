// ItemDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@hooks/auth'
import Header from '@components/Header'
import './index.css'

export default function ItemDetail() {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const { user } = useAuth()

    // fetch single item
    const fetchItem = async () => {
        try {
            const res = await fetch(`http://localhost:3001/items/${id}`)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            setItem(data)
        } catch (e) {
            console.error("Failed to load item:", e)
        }
    }

    useEffect(() => {
        fetchItem()
    }, [id])

    // Borrow handler
    const handleBorrow = async () => {
        if (!user) {
            return window.alert('Please log in to borrow an item.')
        }
        if (!window.confirm('Are you sure you want to borrow this item?')) {
            return
        }
        try {
            const res = await fetch(
                `http://localhost:3001/items/${id}/borrow/${user.id}`,
                { method: 'POST' }
            )
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const updated = await res.json()             // read back the updated document
            setItem(updated)                             // update UI immediately 
            window.alert('Item borrowed successfully!')
        } catch (e) {
            console.error(e)
            window.alert('Failed to borrow. Please try again.')
        }
    }

    // Return handler
    const handleReturn = async () => {
        if (!window.confirm('Are you sure you want to return this item?')) {
            return
        }
        try {
            const res = await fetch(
                `http://localhost:3001/items/${id}/return/${user.id}`,
                { method: 'POST' }
            )
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const updated = await res.json()             
            setItem(updated)                              
            window.alert('Item returned successfully!')
        } catch (e) {
            console.error(e)
            window.alert('Failed to return. Please try again.')
        }
    }

    // Delete handler (unchanged)
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return
        }
        try {
            const response = await fetch(`http://localhost:3001/items/${id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                window.alert('Item deleted successfully!')
                window.location.href = '/'
            } else {
                const errorText = await response.text()
                throw new Error(errorText || 'Failed to delete item')
            }
        } catch (e) {
            console.error(e)
            window.alert('Failed to delete item. Please try again.')
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
                    <p><strong>ID:</strong> {item._id}</p>
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Borrowed:</strong> {item.borrowed ? 'Yes' : 'No'}</p>
                </div>

                <div className="flex space-x-4">
                    {!item.borrowed && user ? (
                        <button
                            onClick={handleBorrow}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
                        >
                            Borrow
                        </button>
                    ) : item.user_id === user?.id ? (
                        <button
                            onClick={handleReturn}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
                        >
                            Return
                        </button>
                    ) : user ? (
                        <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
                            Borrowed
                        </button>
                    ) : (
                        <button
                            onClick={handleBorrow}
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
                        >
                            Login to Borrow
                        </button>
                    )}

                    {user?.admin && (
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </main>

            <footer className="text-center py-4 text-white">
                © UniSA – IVE Project
            </footer>
        </div>
    )
}
