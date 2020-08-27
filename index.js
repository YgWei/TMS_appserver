import config from './config'

import Koa from 'koa'
import cors from 'kcors'
import uuidV4 from 'uuid/v4'
import fs from 'fs-extra'
import errorHandler from './middlewares/errorHandler'
import logMiddleware from './middlewares/log'
import logger from './logger'
import requestId from './middlewares/requestId'
import responseHandler from './middlewares/responseHandler'
import router from './routes'
import koaBody from 'koa-body'
import jwt from 'koa-jwt'
import { secret } from './config/token'

const app = new Koa()

// Directories must exist; path must be relative to the root directory
const requiredDirs = config.folders

async function start() {
  // Create required directories
  Object.keys(requiredDirs).forEach(dir => {
    const path = `${config.root}/${requiredDirs[dir]}`
    fs.ensureDirSync(path)
  })

  // Trust proxy
  app.keys = ['im a newer secret', 'i like turtle']
  app.proxy = true

  app.use(requestId())
  app.use(
    cors({
      origin: '*',
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
      exposeHeaders: ['X-Request-Id']
    })
  )
  app.use(responseHandler())
  app.use(logMiddleware())
  app.use(errorHandler())
  app.use(jwt({ secret }).unless({
    path: [
      /\/home/,
      /\/health/,
      /\/swagger-html/,
      /\/swagger-json/,
      /\/login\/system/,
      /\/login\/gitlab/,
      /\/deployment\/deploy\/success/,
      /\/favicon.ico/
    ]
  }))

  // Set middlewares
  app.use(koaBody({
    multipart: true,
    formLimit: '10mb',
    formidable: {
      uploadDir: config.folders.files,
      keepExtensions: false,
      onFileBegin: function (name, file) {
        const uuid = uuidV4()
        const type = file.type.replace(/.*\//, '')
        file.uuid = uuid
        file.path = `${config.folders.upload}/${uuid}.${type}`
      }
    }
  }))

  // Bootstrap application router
  app.use(router.routes())
  app.use(router.allowedMethods())

  function onError(err, ctx) {
    logger.error({ message: 'Unhandled exception occured', err, ctx })
  }

  // Handle uncaught errors
  app.on('error', onError)

  // Start server
  const server = app.listen(config.port, config.host, () => {
    logger.info(`API server listening on ${config.host}:${config.port}, in ${config.env}`)
  })

  server.on('error', onError)

  return server
}

if (app.env !== 'test') {
  start()
}

export default start
