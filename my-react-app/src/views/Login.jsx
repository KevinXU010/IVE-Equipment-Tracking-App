import { useState } from 'react'
import { login } from '@apis/user'
import { useAuth } from '@hooks/auth'

/**
 * /login
 * @returns
 */
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setToken, setUser } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  const redirect = () => {
    console.log('Redirecting to home page...')
    // Use hard redirect to navigate to the home page
    window.location.href = '/dashboard'
  }

  const handleLogin = () => {
    setError('')
    login(email, password, setToken, setUser, redirect, setError)
  }

  const errorMsg =
    error === '' ? '' : <div className="text-red-500">{error}</div>

  return (
    <>
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
        {isAdmin ? (
          <h1 className="text-2xl font-bold">Login as Admin</h1>
        ) : (
          <h1 className="text-2xl font-bold">Login</h1>
        )}

        <input
          type="email"
          placeholder="UniSA Email"
          name="email"
          className="w-64 p-2 rounded-lg shadow-md border border-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-64 p-2 rounded-lg shadow-md border border-gray-300"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMsg}
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
        >
          Submit
        </button>

        {isAdmin ? (
          <a
            className="text-sm text-gray-600 hover:underline cursor-pointer"
            onClick={() => {
              setIsAdmin(false)
            }}
          >
            I'm not Admin
          </a>
        ) : (
          <a
            className="text-sm text-gray-600 hover:underline cursor-pointer"
            onClick={() => {
              setIsAdmin(true)
            }}
          >
            I'm Admin
          </a>
        )}
        <button
          onClick={() => (window.location.href = '/guest')}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
        >
          Back to Home
        </button>
      </div>
    </>
  )
}

export default Login
