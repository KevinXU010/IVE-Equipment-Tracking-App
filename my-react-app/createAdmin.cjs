// Import the bcrypt library for hashing passwords
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

// Define the MongoDB connection URL and database name
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'iveProject';

// Define the number of salt rounds for hashing
const SALT_ROUNDS = 10;

// Asynchronous function to create the initial admin account
async function createAdmin() {
  const client = new MongoClient(MONGO_URL);

  try {
     // Connect to MongoDB
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection('users');

    // Define static admin credentials
    const email = 'admin@unisa.edu.au';
    const password = 'admin123';

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Get the last inserted user ID to calculate the next ID
    const last = await users.find({}, { projection: { _id: 1 } })
          .sort({ _id: -1 }).limit(1).toArray();

    // Determine the next available user ID
    const nextId = last.length ? last[0]._id + 1 : 1;

    // Check if the admin account already exists (by email)
    const existing = await users.findOne({ email });
    if (existing) {
      console.log('⚠️ Admin already exists');
      return;
    }
    // Insert the new admin user into the database
      await users.insertOne({
          _id: nextId,
      name: 'Admin User',
      email,
      username: 'admin001',
      password: hashedPassword,
      isAdmin: true, // Flag indicating this is an admin account
    });

    console.log('✅ Admin account created successfully');
  } catch (err) {
    // Handle any errors during the process
    console.error('❌ Error:', err);
  } finally {
    // Ensure the database connection is closed
    await client.close();
  }
}

createAdmin();
