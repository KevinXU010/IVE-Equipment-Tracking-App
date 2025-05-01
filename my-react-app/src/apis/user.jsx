import { flushSync } from 'react-dom'

/**
 * Login function, fake login for demo purpose.
 * @param {*} username
 * @param {*} password
 * @param {*} setToken
 * @param {*} setUser
 * @param {*} redirect
 * @param {*} setError
 * @returns
 */
const login = (username, password, setToken, setUser, redirect, setError) => {
  console.log('start loging: ', username, password)

  if (username == '' || password == '') {
    setError('username and password cannot be empty')
    return
  }

  if (username == 'admin' && password == 'admin') {
    flushSync(() => {
      setToken('admin')
      setUser({ username: 'admin' })
    })

    redirect()
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
