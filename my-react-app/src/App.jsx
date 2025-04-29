import React, { useState, useEffect } from 'react';
import './index.css';
import { Html5QrcodeScanner } from 'html5-qrcode';

function App() {
    const [viewItems, setViewItems] = useState(false);
    const [loginPage, setLoginPage] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState([]);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3001/items')
            .then(res => res.json())
            .then(data => {
                console.log("Fetched items:", data);
                setItems(data);
            })
            .catch(err => console.error("Error fetching items:", err));

        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }, []);

    useEffect(() => {
        let scanner;
        if (scanning) {
            scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
            scanner.render(
                (decodedText) => {
                    console.log(`Scan result: ${decodedText}`);
                    setScanning(false);
                    window.location.href = decodedText;
                },
                (error) => {
                    console.warn(`Scan error: ${error}`);
                }
            );
        }
        return () => {
            if (scanner) scanner.clear().catch(e => console.error("Clear scanner error:", e));
        };
    }, [scanning]);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.statement.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            className="font-['Poppins'] w-screen min-h-screen bg-cover bg-no-repeat flex flex-col bg-fixed"
            style={{ backgroundImage: `url('/Web_Background.jpg')` }}
        >
            <header className="text-white text-center py-4 text-2xl font-bold shadow-md">
                <img src="/UniSA-New-Landscape-blue.png" alt="UniSA Logo" className="mx-auto h-12" />
                <div className="mt-2 text-white">IVE: Equipment Tracking App</div>
            </header>

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
                    <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
                        <input
                            type="email"
                            placeholder="UniSA Email"
                            className="w-64 p-2 rounded-lg shadow-md border border-gray-300"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-64 p-2 rounded-lg shadow-md border border-gray-300"
                        />
                        <button
                            onClick={() => {
                                setLoginPage(false);
                                setViewItems(true);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => setLoginPage(false)}
                            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
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
                    <div className="flex flex-col items-center">
                        <button
                            onClick={() => setViewItems(false)}
                            className="mb-6 bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
                        >
                            Back to Home
                        </button>
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-6 w-64 p-2 rounded-lg shadow-md border border-gray-300 text-center"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {filteredItems.map((item, index) => (
                                <div key={index} className="bg-white bg-opacity-90 shadow-xl rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
                                    <img src={item.img} alt={item.name} className="mx-auto rounded h-40 object-contain" />
                                    <img src={item.qr} alt={item.name} className="mx-auto rounded h-20 object-contain" />
                                    <h3 className="mt-2 font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-700">{item.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">Category: {item.statement}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <footer className="text-center py-4 text-white">
                © UniSA - IVE Project
            </footer>
        </div>
    );
}

export default App;
