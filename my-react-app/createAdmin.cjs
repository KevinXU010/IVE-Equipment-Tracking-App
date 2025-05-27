
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'iveProject';
const SALT_ROUNDS = 10;

async function createAdmin() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection('users');

    const email = 'admin@unisa.edu.au';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const last = await users.find({}, { projection: { _id: 1 } })
          .sort({ _id: -1 }).limit(1).toArray();
    const nextId = last.length ? last[0]._id + 1 : 1;
    const existing = await users.findOne({ email });
    if (existing) {
      console.log('⚠️ Admin already exists');
      return;
    }

      await users.insertOne({
          _id: nextId,
      name: 'Admin User',
      email,
      username: 'admin001',
      password: hashedPassword,
      admin: true,
    });

    console.log('✅ Admin account created successfully');
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.close();
  }
}

createAdmin();
