'use strict'

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env file
dotenv.config()

// Get the project base directory
const rootDir = path.resolve(__dirname, '../')

const env = process.env.NODE_ENV || 'development'
const configs = {
  base: {
    env,
    name: process.env.APP_NAME || 'TMS_appserver',
    host: process.env.APP_HOST || '0.0.0.0',
    port: process.env.APP_PORT || 8080,
    root: rootDir,
    authorization: process.env.AUTH_SALT,
    folders: {
      files: 'files',
      logs: 'logs',
      upload: process.env.UPLOAD_PATH || 'uploads'
    },
    log: process.env.LOG || 'development',
    gitlab: {
      url: process.env.GITLAB_URL || 'https://www.belstar.com.cn',
      clientId: process.env.GITLAB_CLIENT_ID || '',
      clientSecret: process.env.GITLAB_CLIENT_SECRET || '',
      redirectUri: process.env.GITLAB_REDIRECT_URI || ''
    },
    authorizationServer: {
      url: process.env.AUTHORIZATION_SERVER_URL || '',
      account: process.env.SYSTEM_ACCOUNT || '',
      password: process.env.SYSTEM_PASSWORD || ''
    },
    cloudStorage: {
      protocol: process.env.CS_PROTOCOL || 'https',
      host: process.env.CS_HOST || '0.0.0.0',
      port: process.env.CS_PORT || 5000,
      collection: process.env.CS_COLLECTION || 'YGBDFE',
      timeout: process.env.CS_TIMEOUT || 1000,
      retryTimes: Number(process.env.RETRY_TIMES) || 2,
      retryDelay: Number(process.env.RETRY_DELAY) || 2000,
      fileExpireHR: Number(process.env.FILE_EXPIRE_HR) || 336
    },
    preprocess: {
      protocol: process.env.PREPROCESS_PROTOCOL || 'http',
      host: process.env.PREPROCESS_HOST || '0.0.0.0',
      port: process.env.PREPROCESS_PORT || 5443
    },
    trace: {
      protocol: process.env.TRACE_PROTOCOL || 'http',
      host: process.env.TRACE_HOST || '0.0.0.0',
      port: process.env.TRACE_PORT || 8487
    }
  },
  production: {
    db: {
      protocal: process.env.DB_PROTOCAL || 'http',
      host: process.env.DB_HOST || '0.0.0.0',
      port: process.env.DB_PORT || 8529,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'Documents'
    }
  },
  development: {
    db: {
      protocal: process.env.DB_PROTOCAL || 'http',
      host: process.env.DB_HOST || '0.0.0.0',
      port: process.env.DB_PORT || 8529,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'Documents'
    }
  },
  test: {
    db: {
      protocal: process.env.TEST_DB_PROTOCAL || 'http',
      host: process.env.TEST_DB_HOST || '0.0.0.0',
      port: process.env.TEST_DB_PORT || 8529,
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_DATABASE || 'Documents'
    }
  }
}
const config = Object.assign(configs.base, configs[env])

export default config
