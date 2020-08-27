import { request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/Notify'
import NotifyServices from '../service/Notify'
import { SUCCESS, Authorization } from '../constants'
// import {} from '../exception/Notify'
import authorization from '../middlewares/authorization'
// import logger from '../logger/develop'
// import { JsonWebTokenError } from 'jsonwebtoken'
const tag = tags(['Notify']) // eslint-disable-line no-unused-vars

export default class NotifyController {
  @request('GET', '/notify')
  @summary('Get notify')
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' }
  })
  @tag
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.findNotifyValidation)
  ])
  @responses(schema.findNotifyResponses)
  static async findNotify(ctx) {
    const notifyServices = new NotifyServices()
    const start = ctx.query.start
    const limit = ctx.query.limit
    const res = await notifyServices.findNotify(start, limit)

    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/notify/personal')
  @summary('Get notify')
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' },
    type: { type: 'string', required: true, default: 'review', description: 'review' }
  })
  @tag
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.findNotifyValidation)
  ])
  @responses(schema.findNotifyResponses)
  static async findPersonalNotify(ctx) {
    const query = ctx.query
    const user = ctx.state.user
    const notifyServices = new NotifyServices()
    const find = await notifyServices.findPersonalNotify(user.uuid, query)
    return ctx.res.ok(find, SUCCESS.message)
  }

  @request('GET', '/notify/{uuid}')
  @summary('Get notify by uuid')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares(
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  )
  @responses(schema.getNotifyByUuidResponses)
  static async getNotifyByUuid(ctx) {
    const notifyServices = new NotifyServices()
    const { uuid } = ctx.validatedParams

    const data = await notifyServices.getNotify(uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('PUT', '/notify/{uuid}/submit/review')
  @summary('submit notify(review).')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @body({
    result: { type: 'string', required: true, default: 'true', description: 'yes or no.' },
    message: { type: 'string', required: true, default: '', description: 'suggest.' }
  })
  @middlewares(
    [authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.submitNotifyReviewValidation)]
  )
  @responses(schema.submitNotifyReviewResponses)
  static async submitNotifyReview(ctx) {
    const notifyServices = new NotifyServices()
    const { uuid } = ctx.validatedParams
    const message = ctx.validatedBody.message
    const result = ctx.validatedBody.result
    const useruuid = ctx.state.user.uuid
    const res = await notifyServices.submit(uuid, result, message, useruuid)
    return ctx.res.ok(res, SUCCESS.message)
  }
}
