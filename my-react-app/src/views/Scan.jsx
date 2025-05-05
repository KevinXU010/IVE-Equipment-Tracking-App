import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom' // Import the useNavigate hook from react-router-dom
import { Html5QrcodeScanner } from 'html5-qrcode' // import QR code scanner

/**
 * URL: /scan
 * @returns {JSX.Element}
 */
function Scan() {
  const navigate = useNavigate() // Initialize the navigate function
  // const [scanning, setScanning] = useState(false);
  const initScanner = () => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 })
    scanner.render(
      (decodedText) => {
        console.log(`Scan result: ${decodedText}`)
        // setScanning(false)
        window.location.href = decodedText
      },
      (error) => {
        console.warn(`Scan error: ${error}`)
      }
    )
  }

  useEffect(() => {
    initScanner()
  })

  return (
    <>
      <div className="bg-white bg-opacity-80 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
        <div className="flex flex-col items-center mt-6">
          <div id="qr-reader"></div>
          <button
            onClick={() => navigate('/guest')}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
          >
            Cancel Scan
          </button>
        </div>
      </div>
    </>
  )
}

export default Scan
