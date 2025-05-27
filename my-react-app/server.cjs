// server.cjs

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies


//  Static file serving for uploaded images (img & qr)

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

//  Multer setup for handling multipart/form-data (file uploads)

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${file.fieldname}-${Date.now()}${ext}`;
        cb(null, name);
    }
});
const upload = multer({ storage });

//  MongoDB connection & collection setup

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'iveProject';
const SALT_ROUNDS = 10;

async function startServer() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log(`✅ Connected to MongoDB at ${MONGO_URL}/${DB_NAME}`);

    const db = client.db(DB_NAME);
    const usersCol = db.collection('users');
    const itemsCol = db.collection('equipments');
    const borrowCol = db.collection('borrowRecords');

    //  POST /login
    app.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await usersCol.findOne({ email });
            if (!user) return res.status(404).json({ message: 'NO_USER' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'BAD_PASSWORD' });

            res.json({
                message: 'OK',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    admin: user.admin || false
                }
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ message: 'SERVER_ERROR' });
        }
    });


    //  POST /register

    app.post('/register', async (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }
        try {
            if (await usersCol.findOne({ email })) {
                return res.status(409).json({ message: 'Email already registered.' });
            }
            const hashed = await bcrypt.hash(password, SALT_ROUNDS);

            // compute next numeric _id
            const last = await usersCol
                .find({}, { projection: { _id: 1 } })
                .sort({ _id: -1 })
                .limit(1)
                .toArray();
            const nextId = last.length ? last[0]._id + 1 : 1;

            const newUser = {
                _id: nextId,
                name,
                email,
                username: email,
                password: hashed,
                admin: false
            };
            await usersCol.insertOne(newUser);
            res.status(201).json({ message: 'User registered successfully.' });
        } catch (err) {
            console.error('Registration error:', err);
            res.status(500).json({ message: 'SERVER_ERROR' });
        }
    });


    //  POST /admin/create  (DEV only)

    app.post('/admin/create', async (req, res) => {
        const { name, email, username, password } = req.body;
        if (!name || !email || !username || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        try {
            if (await usersCol.findOne({ email })) {
                return res.status(409).json({ message: 'Email already exists' });
            }
            const hashed = await bcrypt.hash(password, SALT_ROUNDS);
            const last = await usersCol.find({}, { projection: { _id: 1 } })
                .sort({ _id: -1 }).limit(1).toArray();
            const nextId = last.length ? last[0]._id + 1 : 1;
            await usersCol.insertOne({
                _id: nextId,
                name,
                email,
                username,
                password: hashed,
                admin: true
            });
            res.status(201).json({ message: 'Admin account created.' });
        } catch (err) {
            console.error('Admin creation error:', err);
            res.status(500).json({ message: 'SERVER_ERROR' });
        }
    });


    //  GET /items         — list all equipments

    app.get('/items', async (req, res) => {
        try {
            const all = await itemsCol.find({}).toArray();
            res.json(all);
        } catch (err) {
            console.error('Fetch items error:', err);
            res.status(500).send('SERVER_ERROR');
        }
    });


    //  GET /items/:id     — fetch single equipment

    app.get('/items/:id', async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

        try {
            const item = await itemsCol.findOne({ _id: id });
            if (!item) return res.status(404).json({ message: 'Not found' });
            res.json(item);
        } catch (err) {
            console.error('Fetch item error:', err);
            res.status(500).send('SERVER_ERROR');
        }
    });


    //  POST /items       — add new equipment
    //     multipart/form-data: name, statement, description, img, qr
    app.post(
        '/items',
        upload.fields([
            { name: 'img', maxCount: 1 },
            { name: 'qr', maxCount: 1 }
        ]),
        async (req, res) => {
            try {
                const { name, statement, description } = req.body;
                if (!name) return res.status(400).send('Name is required');

                // compute next numeric _id
                const last = await itemsCol
                    .find({}, { projection: { _id: 1 } })
                    .sort({ _id: -1 })
                    .limit(1)
                    .toArray();
                const nextId = last.length ? last[0]._id + 1 : 1;

                const newItem = {
                    _id: nextId,
                    name,
                    statement: statement || '',
                    description: description || '',
                    borrowed: false,
                    user_id: null,
                    img: req.files.img?.[0]
                        ? `/uploads/${req.files.img[0].filename}`
                        : null,
                    qr: req.files.qr?.[0]
                        ? `/uploads/${req.files.qr[0].filename}`
                        : null
                };

                await itemsCol.insertOne(newItem);
                res.status(201).json(newItem);
            } catch (err) {
                console.error('Add equipment error:', err);
                res.status(500).send('SERVER_ERROR');
            }
        }
    );


    //  7) DELETE /items/:id  — remove equipment

    app.delete('/items/:id', async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).send('Invalid ID');

        try {
            const result = await itemsCol.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return res.status(404).send('Record not found');
            }
            res.sendStatus(200);
        } catch (err) {
            console.error('Delete equipment error:', err);
            res.status(500).send('SERVER_ERROR');
        }
    });


    //  8) /items/:id/borrow/:userId
    //     — record borrow and mark borrowed=true

    // server.cjs
    // … up top you already connect to Mongo and have itemsCol …

    app.post('/items/:id/borrow/:userId', async (req, res) => {
        const id = parseInt(req.params.id, 10)
        const userId = parseInt(req.params.userId, 10)

        try {
            const { matchedCount } = await itemsCol.updateOne(
                { _id: id },
                { $set: { borrowed: true, user_id: userId } }
            )

            if (matchedCount === 0) {
                return res.status(404).json({ message: 'Item not found' })
            }

            // fetch the updated doc and return it
            const updated = await itemsCol.findOne({ _id: id })
            res.json(updated)
        } catch (err) {
            console.error('Borrow error:', err)
            res.status(500).json({ message: 'SERVER_ERROR' })
        }
    })

    // Return an item
    app.post('/items/:id/return/:userId', async (req, res) => {
        const id = parseInt(req.params.id, 10)
        const userId = parseInt(req.params.userId, 10)

        try {
            const { matchedCount } = await itemsCol.updateOne(
                { _id: id, user_id: userId },
                { $set: { borrowed: false }, $unset: { user_id: "" } }
            )

            if (matchedCount === 0) {
                return res.status(400).json({ message: 'Item is not borrowed by this user' })
            }

            const updated = await itemsCol.findOne({ _id: id })
            res.json(updated)
        } catch (err) {
            console.error('Return error:', err)
            res.status(500).json({ message: 'SERVER_ERROR' })
        }
    })


    //  Start the server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

startServer().catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
