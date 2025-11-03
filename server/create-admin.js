require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// The User Schema definition is duplicated here for simplicity in this utility script
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}));

async function createAdmin() {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to DB for Admin Creation');

    // 2. Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@s-creations.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists. Skipping creation.');
      return;
    }

    // 3. Create and save admin
    const password = await bcrypt.hash('admin123', 12);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@s-creations.com',
      password,
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@s-creations.com');
    console.log('Password: admin123');
    
  } catch (err) {
    console.error('❌ DB Error or Admin Creation Failed:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
