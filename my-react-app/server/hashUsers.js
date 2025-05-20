const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const SALT_ROUNDS = 10;

async function encryptPasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find();
    for (let user of users) {
      
      if (user.password.startsWith('$2b$')) {
        console.log(`Password for ${user.username} is already hashed.`);
        continue;
      }

      const hashed = await bcrypt.hash(user.password, SALT_ROUNDS);
      user.password = hashed;
      await user.save();
      console.log(`Hashed password for ${user.username}`);
    }

    console.log('✅ All user passwords hashed!');
    process.exit();
  } catch (error) {
    console.error('Error hashing passwords:', error);
    process.exit(1);
  }
}

encryptPasswords();

