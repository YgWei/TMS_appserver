'use strict'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import path from 'path'
import appConfig from '../config'

const { name } = appConfig
const directory = process.env.LOG_DIRECTORY || path.join(__dirname, '../logs')
const fileName = process.env.LOG_FILENAME || `${name}`
const { combine, timestamp, prettyPrint, printf } = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    prettyPrint(),
    printf((info) => {
      const {
        timestamp, level, message, err, ...args
      } = info

      const ts = timestamp
      if (err) {
        return `[${ts}][${level}]: ${message}${err.stack}`
      }
      return `[${ts}][${level}]: ${message}  ${Object.keys(args).length ? JSON.stringify(args) : ''}`
    })
  ),
  transports: [
    new (DailyRotateFile)({
      filename: `${fileName}.%DATE%.log`,
      dirname: directory,
      datePattern: 'YYYY-MM-DD'
    })
  ]
})

export default logger
