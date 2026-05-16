require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const logger = require('./utils/logger'); // Moved up
const passport = require('./config/passport');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes/index');
const { globalRateLimiter } = require('./middleware/rateLimiter.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// 4. NoSQL injection prevention
app.use(mongoSanitize());

// 5. XSS prevention
app.use(xss());

// 6. HTTP parameter pollution prevention
app.use(hpp());

// 7. HTTP request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: logger.stream }));

// 8. Passport initialize
app.use(passport.initialize());

// 9. Global rate limiter
app.use('/api', globalRateLimiter);

// 10. Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 11. API Routes
app.use('/api', routes);

// 12. Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'SkillForge API is running 🚀' });
});

// 13. 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// 14. Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
