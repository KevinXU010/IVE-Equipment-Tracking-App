import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function AddEquipment() {
  const [name, setName] = useState('')
  const [statement, setStatement] = useState('')
  const [description, setDescription] = useState('')
  const [img, setImg] = useState(null)
  const [qr, setQr] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name) {
      setError('Device name cannot be empty.')
      return
    }
    setError('')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('statement', statement)
    formData.append('description', description)
    if (img) formData.append('img', img)
    if (qr) formData.append('qr', qr)

    try {
      const response = await fetch('/items', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        navigate('/dashboard')
      } else {
        setError('Failed to add equipment. Please try again.')
      }
    } catch (err) {
      console.error('Error adding equipment:', err)
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Equipment</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
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
            htmlFor="statement"
            className="text-gray-700 font-bold w-1/3 pr-2 text-right"
          >
            Device Category
          </label>
          <input
            type="text"
            id="statement"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            className="w-2/3 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4 flex items-start">
          <label
            htmlFor="description"
            className="text-gray-700 font-bold w-1/3 pr-2 text-right pt-2"
          >
            Device Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-2/3 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label
            htmlFor="img"
            className="text-gray-700 font-bold w-1/3 pr-2 text-right"
          >
            Device Image
          </label>
          <input
            type="file"
            id="img"
            onChange={(e) => setImg(e.target.files[0])}
            className="w-2/3 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-6 flex items-center">
          <label
            htmlFor="qr"
            className="text-gray-700 font-bold w-1/3 pr-2 text-right"
          >
            QR Code Image
          </label>
          <input
            type="file"
            id="qr"
            onChange={(e) => setQr(e.target.files[0])}
            className="w-2/3 p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Equipment
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </form>
    </div>
  )
}

export default AddEquipment
