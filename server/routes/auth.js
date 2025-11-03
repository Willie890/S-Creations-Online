const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // The password hashing is handled by the pre('save') hook in the User model
    user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);
    // Send back the token and essential user data
    res.status(201).json({ 
      token, 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const token = generateToken(user);
    res.json({ 
      token, 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @desc    Get all users (Admin only route for the admin panel)
// @route   GET /api/auth/users
router.get('/users', require('../middleware/auth').protect, require('../middleware/auth').adminOnly, async (req, res) => {
  try {
    // Select all users but exclude the password field for security
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

module.exports = router;
