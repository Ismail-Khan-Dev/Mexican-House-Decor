const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'app.log');

const logger = {
  info: (message, data = '') => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message} ${data}`;
    console.log(logMessage);
    fs.appendFileSync(logFile, logMessage + '\n');
  },

  error: (message, error = '') => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message} ${error}`;
    console.error(logMessage);
    fs.appendFileSync(logFile, logMessage + '\n');
  },

  warn: (message, data = '') => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message} ${data}`;
    console.warn(logMessage);
    fs.appendFileSync(logFile, logMessage + '\n');
  },

  debug: (message, data = '') => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] DEBUG: ${message} ${data}`;
      console.log(logMessage);
      fs.appendFileSync(logFile, logMessage + '\n');
    }
  },
};

module.exports = logger;
