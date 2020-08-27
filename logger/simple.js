'use strict'
import winston from 'winston'

const { combine, timestamp, prettyPrint, printf, colorize } = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    prettyPrint(),
    colorize(),
    timestamp(),
    printf((info) => {
      const {
        timestamp, level, message, err
      } = info

      const ts = timestamp
      if (err) {
        return `[${ts}][${level}]: ${message}\n${err.stack}`
      }
      return `[${ts}][${level}]: ${message}`
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
})

export default logger
