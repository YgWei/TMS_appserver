'use strict'
import logger from '../logger'

import {
  UNKNOWN_ENDPOINT,
  UNKNOWN_ERROR,
  JWT_AUTHENTICATION_ERROR,
  INVALID_REQUEST,
  FORBIDDEN,
  NOT_FOUND
} from '../constants'

/**
 * Return middleware that handle exceptions in Koa.
 * Dispose to the first middleware.
 *
 * @return {function} Koa middleware.
 */
export default () => {
  return async (ctx, next) => {
    try {
      await next()
      // Respond 404 Not Found for unhandled request
      if (!ctx.body && (!ctx.status || ctx.status === 404)) {
        ctx.res.notFound(UNKNOWN_ENDPOINT.code, UNKNOWN_ENDPOINT.message)
      }
    } catch (err) {
      if (err.isJoi) {
        logger.warn('Catch by errorHandle : ', err)
        return ctx.res.badRequest(INVALID_REQUEST.code, INVALID_REQUEST.message, err.details)
      } else if (err.status === 400) {
        logger.warn('Catch by errorHandle : ', err)
        return ctx.res.badRequest(INVALID_REQUEST.code, INVALID_REQUEST.message, err.message)
      } else if (err.status === 401) {
        logger.warn('Catch by errorHandle : ', err)
        return ctx.res.unauthorized(JWT_AUTHENTICATION_ERROR.code, JWT_AUTHENTICATION_ERROR.message, err)
      } else if (err.status === 403) {
        logger.warn('Catch by errorHandle : ', err)
        return ctx.res.forbidden(FORBIDDEN.code, FORBIDDEN.message, err)
      } else if (err.status === 404) {
        return ctx.res.notFound(NOT_FOUND.code, err.message, { ...err.data })
      } else if (err.status === 500) {
        logger.error('Catch by errorHandle : ', err)
        return ctx.res.internalServerError(err.name, err.message, { ...err.data })
      } else {
        logger.error({ message: 'Unhandled exception occured', err, ctx })
        return ctx.res.internalServerError(UNKNOWN_ERROR.code, UNKNOWN_ERROR.message, { err: err.message })
      }
    }
  }
}
