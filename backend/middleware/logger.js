const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream for logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Custom morgan format for production
const productionFormat = ':method :url :status :res[content-length] - :response-time ms :date[web]';

// Development vs Production logging
const logger = process.env.NODE_ENV === 'production' 
  ? morgan(productionFormat, { stream: accessLogStream })
  : morgan('dev');

module.exports = logger;
