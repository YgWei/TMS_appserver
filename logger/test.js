'use strict'
import winston from 'winston'

const { combine, printf, prettyPrint, colorize, timestamp } = winston.format

const logger = winston.createLogger({
  level: 'debug',
  format: combine(
    prettyPrint(),
    colorize(),
    timestamp(),
    printf((info) => {
      const {
        timestamp, level, message, err, ...args
      } = info

      const ts = timestamp
      if (err) {
        return `[${ts}][${level}]: ${message}\n${err.stack}`
      }
      return `[${ts}][${level}]: ${message}${Object.keys(args).length ? '\n' + JSON.stringify(args, null, 2) : ''}`
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
})

export default logger
