require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Validate required env vars
const required = ['MONGO_URI', 'JWT_SECRET', 'RESET_TOKEN_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  logger.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    logger.info(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}).catch((err) => {
  logger.error(`Failed to connect to database: ${err.message}`);
  process.exit(1);
});
