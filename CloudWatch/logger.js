const winston = require('winston');
const path = require("path");

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() 
  ),
  transports: [
    new winston.transports.File({ filename: 'info-log-csye6225.log' }),
    new winston.transports.Console()
  ],
  options: {
    timezonw: "America/New_York",
  },
});

module.exports = logger;