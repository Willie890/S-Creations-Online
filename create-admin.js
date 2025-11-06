require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to DB for admin creation'))
  .catch(err => {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  });

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@s-creations.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      mongoose.connection.close();
      return;
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@s-creations.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@s-creations.com');
    console.log('Password: admin123');
    
  } catch (err) {
    console.error('❌ Error creating admin:', err);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
