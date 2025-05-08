import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' // import React Link
import { Html5QrcodeScanner } from 'html5-qrcode' // import QR code scanner
import { useAuth } from '@hooks/auth' // import auth context hook
import './index.css'

function App() {
  // state variables
  const [viewItems, setViewItems] = useState(false)
  const [loginPage, setLoginPage] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState([])
  const [scanning, setScanning] = useState(false)
  // toggle between 'grid' and 'table'
  const [viewType, setViewType] = useState('grid')

  // state for controlled login form and error handling
  const [email, setEmail] = useState('') // email input
  const [password, setPassword] = useState('') // password input
  const [loginError, setLoginError] = useState('') // login error message

  // toggle between normal user and admin login
  const [isAdmin, setIsAdmin] = useState(false)

  // auth context hook to manage user state
  const { user, setToken, setUser } = useAuth()

  useEffect(() => {
    // Fetch data from the backend (make sure your backend is running on port 3001)
    fetch('http://localhost:3001/items')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched items:', data)
        setItems(data)
      })
      .catch((err) => console.error('Error fetching items:', err))

    // Load Google Fonts (Poppins)
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  // QR code scanner
  useEffect(() => {
    // Initialize the scanner only if scanning is true
    // QR code scanner setup/cleanup
    let scanner
    if (scanning) {
      scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 })
      scanner.render(
        (decodedText) => {
          console.log(`Scan result: ${decodedText}`)
          setScanning(false)
          window.location.href = decodedText
        },
        (error) => {
          console.warn(`Scan error: ${error}`)
        }
      )
    }
    return () => {
      if (scanner)
        scanner.clear().catch((e) => console.error('Clear scanner error:', e))
    }
  }, [scanning])

  // Filter items based on search term (using name and statement)
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.statement.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Detailed login handler with status‐based messages
  const handleLogin = async () => {
    setLoginError('')
    try {
      const res = await fetch('http://localhost:3001/login', {
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
          setLoginError('No account found for that email.')
          window.alert('❌ No account found for that email.')
        } else if (text === 'BAD_PASSWORD') {
          setLoginError('Incorrect password.')
          window.alert('❌ Incorrect password.')
        } else {
          setLoginError('Server error – please try again.')
          window.alert('❌ Server error – please try again.')
        }
        return
      }

      // success
      if (text === 'OK') {
        // window.alert('✅ Login successful!')
        const token = 'testtoken' // current token is fake, just for demo purpose
        setToken(token) // Set the token in the context
        setUser(result.data) // Set the user in the context
        setLoginPage(false)
        setViewItems(true)
      }
    } catch (err) {
      setLoginError('Network error – please try again.')
      window.alert('❌ Network error – please try again.')
    }
  }

  return (
    <div
      className="font-['Poppins'] w-screen min-h-screen bg-cover bg-no-repeat flex flex-col bg-fixed"
      style={{ backgroundImage: `url('/Web_Background.jpg')` }}
    >
      {/* HEADER */}
      <header className="text-white text-center py-4 text-2xl font-bold shadow-md">
        <img
          src="/UniSA-New-Landscape-blue.png"
          alt="UniSA Logo"
          className="mx-auto h-12"
        />
        <div className="mt-2 text-white">IVE: Equipment Tracking App</div>
      </header>

      {/* HOME CONTROLS */}
      <main className="flex flex-col items-center justify-center flex-1 z-10 text-center gap-6">
        {!viewItems && !loginPage && !scanning ? (
          <div className="bg-white bg-opacity-80 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
            <button
              onClick={() => setLoginPage(true)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={() => setViewItems(true)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
            >
              View Items
            </button>
            <button
              onClick={() => setScanning(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
            >
              Scan QR Code
            </button>
          </div>
        ) : loginPage ? (
          <div className="max-w-sm mx-auto bg-white bg-opacity-90 p-8 rounded-xl shadow-xl">
            {isAdmin ? (
              <h2 className="text-xl mb-4">Admin, please log in</h2>
            ) : (
              <h2 className="text-xl mb-4">Please log in</h2>
            )}
            {loginError && <p className="text-red-600 mb-2">{loginError}</p>}
            <input
              type="email"
              placeholder="UniSA Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 rounded border"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-3 rounded border"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
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
              onClick={() => {
                setLoginPage(false)
                setLoginError('')
              }}
              className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
            >
              Back to Home
            </button>
          </div>
        ) : scanning ? (
          <div className="flex flex-col items-center mt-6">
            <div id="qr-reader"></div>
            <button
              onClick={() => setScanning(false)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
            >
              Cancel Scan
            </button>
          </div>
        ) : (
          <div className="w-full px-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setViewItems(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md"
              >
                Back to Home
              </button>
              {/* ITEMS VIEW */}
              {/* Grid/Table toggle buttons with same styling */}
              <div className="space-x-2">
                <button
                  onClick={() => setViewType('grid')}
                  className={`py-2 px-6 rounded-lg shadow-md 
                                        ${
                                          viewType === 'grid'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-500 hover:bg-gray-600 text-white'
                                        }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewType('table')}
                  className={`py-2 px-6 rounded-lg shadow-md 
                                        ${
                                          viewType === 'table'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-500 hover:bg-gray-600 text-white'
                                        }`}
                >
                  Table
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-6 w-64 p-2 rounded-lg shadow-md border border-gray-300 text-center"
            />

            {/* Conditional rendering for grid vs table */}

            {viewType === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white bg-opacity-90 shadow-xl rounded-lg p-4 text-center transform hover:scale-105 transition-transform"
                  >
                    {/* Using item.img because our backend returns img */}
                    <img
                      src={item.img}
                      alt={item.name}
                      className="mx-auto rounded h-40 object-contain"
                    />
                    {/*<img src={item.qr} alt={item.name} className="mx-auto rounded h-20 object-contain" />*/}
                    <h3 className="mt-2 font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-700">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {item.statement}
                    </p>
                    {/* per-card View Details link */}
                    <Link to={`/items/${item.id}`}>
                      <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
                        View Details
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full bg-white bg-opacity-90 rounded-lg shadow-xl">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Image</th>
                    <th className="p-2">QR Code</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Category</th>
                    {/* View Details button in each card */}
                    <th>View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => (
                    <tr key={idx} className="border-b even:bg-gray-100">
                      <td className="p-2">{item.id}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-20 mx-auto"
                        />
                      </td>
                      <td className="p-2">
                        <img src={item.qr} alt="QR" className="h-20 mx-auto" />
                      </td>
                      <td className="p-2">{item.description}</td>
                      <td className="p-2">{item.statement}</td>
                      <Link
                        to={`/items/${
                          filteredItems[filteredItems.length - 1].id
                        }`}
                      >
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md">
                          View Details
                        </button>
                      </Link>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-4 text-white">
        © UniSA - IVE Project
      </footer>
    </div>
  )
}

export default App
