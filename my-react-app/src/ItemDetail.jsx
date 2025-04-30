import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './index.css';

export default function ItemDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/items')
            .then(res => res.json())
            .then(data => setItem(data.find(i => String(i.id) === id)))
            .catch(console.error);
    }, [id]);

    // handler to flip Borrowed → true
    const handleBorrow = async () => {
        await fetch(`http://localhost:3001/items/${id}/borrow`, { method: 'POST' });
        setItem(prev => ({ ...prev, Borrowed: 1 }));
    };

    // handler to flip Borrowed → false
    const handleReturn = async () => {
        await fetch(`http://localhost:3001/items/${id}/return`, { method: 'POST' });
        setItem(prev => ({ ...prev, Borrowed: 0 }));
    };

    if (!item) {
        return (
            <div
                className="font-['Poppins'] w-screen min-h-screen bg-cover bg-fixed bg-no-repeat flex items-center justify-center"
                style={{ backgroundImage: "url('/Web_Background.jpg')" }}
            >
                <span className="text-white text-xl">Loading…</span>
            </div>
        );
    }

    return (
        <div
            className="font-['Poppins'] w-screen min-h-screen bg-cover bg-fixed bg-no-repeat flex flex-col"
            style={{ backgroundImage: "url('/Web_Background.jpg')" }}
        >
            <header className="text-white text-center py-4 text-2xl font-bold shadow-md">
                <img src="/UniSA-New-Landscape-blue.png" alt="UniSA Logo" className="mx-auto h-12" />
                <div className="mt-2">IVE: Equipment Tracking App</div>
            </header>

            <main className="flex-1 p-8 space-y-6 text-white">
                <Link
                    to="/"
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
                >
                    Back
                </Link>

                <h1 className="text-4xl font-bold">{item.name}</h1>

                <div className="flex flex-wrap gap-8">
                    <img src={item.img} alt={item.name} className="h-48 rounded-lg shadow-lg" />
                    {item.qr && (
                        <img src={item.qr} alt="QR Code" className="h-48 rounded-lg shadow-lg" />
                    )}
                </div>

                <div className="space-y-2 text-gray-100">
                    <p><strong>ID:</strong> {item.id}</p>
                    <p><strong>Category:</strong> {item.statement}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Borrowed:</strong> {item.Borrowed ? 'Yes' : 'No'}</p>
                </div>

                {/* Borrow / Return buttons */}
                <div className="flex space-x-4">
                    {!item.Borrowed ? (
                        <button
                            onClick={handleBorrow}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
                        >
                            Borrow
                        </button>
                    ) : (
                        <button
                            onClick={handleReturn}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
                        >
                            Return
                        </button>
                    )}
                </div>
            </main>

            <footer className="text-center py-4 text-white">
                © UniSA - IVE Project
            </footer>
        </div>
    );
}
