import logger from '../logger'

function reqSerializer(ctx = {}) {
  return {
    method: ctx.method,
    path: ctx.path,
    url: ctx.url,
    headers: ctx.headers,
    protocol: ctx.protocol,
    ip: ctx.ip,
    query: ctx.query
  }
}

function resBodySerializer({ status, code, message } = {}) {
  const body = { status, message }
  if (code) {
    body.code = code
  }
  return body
}

function resSerializer(ctx = {}) {
  return {
    statusCode: ctx.status,
    responseTime: ctx.responseTime,
    type: ctx.type,
    headers: (ctx.response || {}).headers,
    body: resBodySerializer(ctx.body)
  }
}

/**
 * Return middleware that attachs logger to context and
 * logs HTTP request/response.
 *
 * @param {Object} options={} - Optional configuration.
 * @param {Object} options.logger - Logger instance of bunyan.
 * @return {function} Koa middleware.
 */
export default (options = {}) => {
  return async (ctx, next) => {
    if (ctx.request.path === '/api/health') {
      await next()
      return
    }

    const startTime = new Date()
    logger.info({
      message: `${ctx.req.method}, ${ctx.req.url} Request start.`,
      data: {
        reqId: ctx.reqId,
        req: reqSerializer(ctx)
      }
    })

    await next()

    ctx.responseTime = new Date() - startTime
    logger.info({
      data: { reqId: ctx.reqId, res: resSerializer(ctx) },
      message: `${ctx.req.method}, ${ctx.req.url} Request successfully completed.`
    })
  }
}
