import { useNavigate, Link } from 'react-router-dom' // Import the useNavigate hook from react-router-dom
import React, { useState, useEffect } from 'react'
import { useAuth } from '@hooks/auth'
/**
 * URL: /dashboard
 * @returns
 */
function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState([])
  const [viewType, setViewType] = useState('grid')
  const { user } = useAuth() // Use the useAuth hook to get the user object

  const navigate = useNavigate() // Initialize the navigate function

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

  // Filter items based on search term (using name and statement)
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.statement.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col items-center">
      <div className="w-full px-4">
        <div className="flex justify-between items-center my-4">
          <button
            onClick={() => navigate('/guest')}
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
        <div className="flex justify-between items-center mb-6 ">
          <div className="w-full flex justify-start">
            {user && (
              <button
                onClick={() => navigate('/items/new')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md"
              >
                Add Equipment
              </button>
            )}
            &nbsp;
          </div>
          <div className="w-auto items-center justify-center">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 p-2 rounded-lg shadow-md border border-gray-300 text-center"
            />
          </div>
          <div className="w-full">&nbsp;</div>
        </div>

        {/* Conditional rendering for grid vs table */}

        {viewType === 'grid' ? (
          <div className="max-full grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <table className="max-full bg-white bg-opacity-90 rounded-lg shadow-xl">
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
                  <td className="p-2">
                    <Link
                      to={`/items/${
                        filteredItems[filteredItems.length - 1].id
                      }`}
                    >
                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Dashboard
