const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
router.get('/', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password'); // Exclude passwords
  res.json(users);
});

// @desc    Promote/Demote a user (admin only)
// @route   PATCH /api/users/:id/role
router.patch('/:id/role', protect, adminOnly, async (req, res) => {
  const { role } = req.body;

  if (role !== 'user' && role !== 'admin') {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User ${user.email} role updated to ${role}`, user: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

module.exports = router;
