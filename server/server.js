require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser'); // <--- NEW IMPORT

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');
const cartRoutes = require('./routes/cart');

// Import middleware (must be defined BEFORE use)
const { protect } = require('./middleware/auth'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Define the allowed origin for CORS
const allowedOrigin = 'https://s-creations.netlify.app'; // <--- FIX: Your Netlify URL

// Middleware
// 1. Configure CORS to allow your frontend's origin
app.use(cors({
  origin: allowedOrigin,
  credentials: true // Allows cookies/headers to be sent cross-origin (essential for auth)
}));

app.use(express.json());
// 2. Use cookie-parser
app.use(cookieParser()); // <--- NEW USE

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/cart', protect, cartRoutes);

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
