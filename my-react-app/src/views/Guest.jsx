import { useNavigate } from 'react-router-dom' // Import the useNavigate hook from react-router-dom

function Guest() {
  const navigate = useNavigate() // Initialize the navigate function

  return (
    <>
      <div className="bg-white bg-opacity-80 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
        <button
          onClick={() => navigate('/login')} // Navigate to the /login route when clicked
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
        >
          View Items
        </button>
        <button
          onClick={() => navigate('/scan')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
        >
          Scan QR Code
        </button>
      </div>
    </>
  )
}

export default Guest
