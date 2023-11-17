const winston = require('winston');
const { combine, timestamp, printf, colorize, errors } = winston.format;
const WinstonCloudWatch = require('winston-cloudwatch');
require('dotenv').config();

// Define your custom format with printf.
const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the default minimum level to log. Change this to debug for more verbose logging
  format: combine(
    timestamp(), // Add timestamp to each log
    errors({ stack: true }), // Ensure to log the stack trace if available
    myFormat // Custom format for log string
  ),
  transports: [
    // Default transport is console. It outputs the logs to the console.
    new winston.transports.Console({ format: combine(colorize(), myFormat) }),
  ],
});

// In production, write to a file and to CloudWatch, in addition to the console.
console.log(process.env.NODE_ENV )
if (process.env.NODE_ENV === 'production') {
    // if ('production' === 'production') {
  console.log('adding in log')
  logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
  logger.add(new winston.transports.File({ filename: 'combined.log' }));
  
}

module.exports = logger;
