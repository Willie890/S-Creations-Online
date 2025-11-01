require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser'); // <--- ADDED

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
const allowedOrigin = 'https://s-creations.netlify.app'; // <--- YOUR FRONTEND URL

// Middleware
// 1. Configure CORS with the specific origin and credentials
app.use(cors({
  origin: allowedOrigin,
  credentials: true // Crucial for token/session/cookie exchange
}));

app.use(express.json());
// 2. Use cookie-parser
app.use(cookieParser()); // <--- ADDED

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
