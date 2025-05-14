const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');


const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection details
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'iveProject';

const client = new MongoClient(MONGO_URL);

async function startServer() {
    try {
        await client.connect();
        console.log(`✅ Connected to MongoDB at ${MONGO_URL}/${DB_NAME}`);
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const items = db.collection('equipments');

        // LOGIN ENDPOINT
        // POST /login
        // Expects JSON body: { email, password }
        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            // find user by email
            const user = await users.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'No account found for that email.' });
            }
            // compare password
            const ok = await bcrypt.compare(password, user.password);
            if (!ok) {
                return res.status(401).json({ message: 'Incorrect password.' });
            }
            // succes
            res.json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    is_admin: user.admin
                }
            });
        });

        // LIST ALL ITEMS
        app.get('/items', async (req, res) => {
            const all = await items.find({}).toArray();
            res.json(all);
        });

        // GET SINGLE ITEM
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const it = await items.findOne({ _id: new ObjectId(id) });
            if (!it) return res.status(404).json({ message: 'Item not found' });
            res.json(it);
        });

        // BORROW AN ITEM
        app.post('/items/:id/borrow', async (req, res) => {
            const id = req.params.id;
            const result = await items.updateOne(
                { _id: new ObjectId(id) },
                { $set: { borrowed: true } }
            );
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json({ message: 'Item borrowed' });
        });

        // RETURN AN ITEM
        app.post('/items/:id/return', async (req, res) => {
            const id = req.params.id;
            const result = await items.updateOne(
                { _id: new ObjectId(id) },
                { $set: { borrowed: false } }
            );
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json({ message: 'Item returned' });
        });

        // START EXPRESS
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

// Kick things off
startServer();
