const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// @desc    Promote/Demote user (admin only)
// @route   PATCH /api/users/:id/role
router.patch('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: `User role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

module.exports = router;
