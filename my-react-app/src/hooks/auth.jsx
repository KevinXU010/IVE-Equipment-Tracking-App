import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem('token'))
  const [user, setUser_] = useState(JSON.parse(localStorage.getItem('user')))

  // Function to set the authentication token
  const setToken = (newToken) => {
    console.log('setToken', newToken)

    if (newToken === null || newToken === undefined) {
      setToken_(null)
      setUser_(null)
      return
    }

    setToken_(newToken)
  }

  const setTokenAsync = (newToken) => {
    return new Promise((resolve) => {
      setToken_(newToken, resolve)
    })
  }

  const setUser = (newUser) => {
    setUser_(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

      localStorage.setItem('token', token)
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }, [token])

  // Memoized value of the authentication context
  const contextValue = {
    token,
    setToken,
    setTokenAsync,
    user,
    setUser,
  }

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
