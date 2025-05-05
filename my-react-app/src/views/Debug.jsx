import { useNavigate } from 'react-router-dom' // Import the useNavigate hook from react-router-dom
import React, { useState } from 'react'
import bcrypt from 'bcryptjs'

function Debug() {
  const navigate = useNavigate() // Initialize the navigate function
  const [inputString, setInputString] = useState('')
  const [encryptedString, setEncryptedString] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEncrypt = () => {
    if (inputString) {
      setIsLoading(true)
      try {
        // Generate salt, the second parameter is the number of salt rounds. The higher the number, the more secure but the lower the performance.
        const salt = bcrypt.genSaltSync(10)
        // Hash the input string using the salt
        const hash = bcrypt.hashSync(inputString, salt)
        setEncryptedString(hash)
      } catch (error) {
        console.error('Encryption failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <div className="bg-white bg-opacity-80 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold mb-4">Debug Page Instructions</h2>
        <p className="text-gray-700 mb-6">
          This page is used to debug application features. Currently, it
          provides a password generator function. You can enter a string, click
          the "Encrypt" button, and the corresponding encrypted string will be
          output.
        </p>
        <div className="flex flex-col items-center gap-4 w-full">
          <input
            type="text"
            placeholder="Enter the string to encrypt"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleEncrypt}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md"
            disabled={isLoading}
          >
            {isLoading ? 'Encrypting...' : 'Encrypt'}
          </button>
          {encryptedString && (
            <div className="w-full p-2 border border-gray-300 rounded-lg text-center">
              Encrypted string: {encryptedString}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Debug
