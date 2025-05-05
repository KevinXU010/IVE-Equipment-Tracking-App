import { flushSync } from 'react-dom'

/**
 * Login function
 * @param {*} email
 * @param {*} password
 * @param {*} setToken
 * @param {*} setUser
 * @param {*} redirect
 * @param {*} setError
 * @returns
 */
const login = async (
  email,
  password,
  setToken,
  setUser,
  redirect,
  setError
) => {
  setError('')
  console.log('start loging: ', email, password)

  if (email == '' || password == '') {
    setError('email and password cannot be empty')
    return
  }

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    // response format:
    // { message: 'OK', data: {"id":1,"name":"Alex Pepicelli","email":"alex.pepicelli@unisa.edu.au","username":"alex001","admin":true}}
    // { message: 'NO_USER'}
    // { message: 'BAD_PASSWORD'}
    // { message: 'Server error'}
    const result = await res.json()
    const text = result.message

    if (!res.ok) {
      if (text === 'NO_USER') {
        setError('No account found for that email.')
        window.alert('❌ No account found for that email.')
      } else if (text === 'BAD_PASSWORD') {
        setError('Incorrect password.')
        window.alert('❌ Incorrect password.')
      } else {
        setError('Server error – please try again.')
        window.alert('❌ Server error – please try again.')
      }
      return
    }

    console.log({ text })
    // success
    if (text === 'OK') {
      // window.alert('✅ Login successful!')
      flushSync(() => {
        // const token = result.data.token // Get the token from the response
        const token = 'testtoken' // current token is fake, just for demo purpose
        setToken(token) // Set the token in the context
        setUser(result.data) // Set the user in the context
      })
      // redirect()
    }
  } catch (err) {
    setError('Network error – please try again.')
    window.alert('❌ Network error – please try again.')
  }
}

/**
 * Logout function, fake logout for demo purpose.
 * @param {*} setToken
 * @param {*} redirect
 */
const logout = (setToken, redirect) => {
  setToken()
  redirect()
}

export { login, logout }
