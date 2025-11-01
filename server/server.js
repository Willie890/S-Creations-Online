require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // NEW
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/users'); // NEW

// Import middleware (must be defined BEFORE use)
const { protect } = require('./middleware/auth'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  credentials: true, // IMPORTANT for HttpOnly cookies
  origin: 'https://s-creations-online.onrender.com' // Set to your frontend domain
}));
app.use(express.json());
app.use(cookieParser()); // NEW: Use cookie parser

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', protect, checkoutRoutes); // ADDED protect middleware
app.use('/api/cart', protect, cartRoutes);
app.use('/api/users', protect, userRoutes); // NEW

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
