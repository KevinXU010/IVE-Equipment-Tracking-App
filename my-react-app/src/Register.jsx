import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register({ backToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // State to store the confirmed password
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      setError('Name, email, password, and confirm password cannot be empty.')
      return
    }
    // Verify if the two password inputs match
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')

    const data = {
      name,
      email,
      password,
    }

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        backToLogin()
      } else {
        setError('Failed to register. Please try again.')
      }
    } catch (err) {
      console.error('Error registering user:', err)
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="mb-4 flex items-center">
          <label
            htmlFor="name"
            className="text-gray-700 font-bold w-1/3 pr-2 text-right"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-2/3 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label
            htmlFor="email"
            className="text-gray-700 font-bold w-1/3 pr-2 text-right"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-2/3 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label
            htmlFor="password"
            className="text-gray-700 font-bold w-1/3 pr-2 text-right"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-2/3 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* New input field for confirming the password */}
        <div className="mb-4 flex items-center">
          <label
            htmlFor="confirmPassword"
            className="text-gray-700 font-bold w-1/3 pr-2 text-right"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-2/3 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Register
        </button>
        <button
          onClick={() => backToLogin()}
          className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Back to Login
        </button>
      </form>
    </div>
  )
}

export default Register
