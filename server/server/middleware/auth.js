// server/middleware/auth.js
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  let token
  
  if (req.cookies.token) {
    token = req.cookies.token
  }
  
  if (!token) {
    return res.status(401).json({
      message: 'Not authorized to access this route'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
  } catch (err) {
    return res.status(401).json({
      message: 'Not authorized to access this route'
    })
  }
}

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  return res.status(403).json({
    message: 'Not authorized as admin'
  })
}
