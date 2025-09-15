require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xss = require('xss-clean');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorHandler');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running'
  });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
