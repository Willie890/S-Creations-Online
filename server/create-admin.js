require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to DB'))
  .catch(err => console.error('❌ DB Error:', err));

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}));

async function createAdmin() {
  const password = await bcrypt.hash('admin123', 12);
  const admin = new User({
    name: 'Admin User',
    email: 'admin@s-creations.com',
    password,
    role: 'admin'
  });
  await admin.save();
  console.log('✅ Admin created!');
  mongoose.connection.close();
}

createAdmin();
