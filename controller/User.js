import { request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
// import validate from '../middlewares/validate'
import * as schema from '../schema/User'
import UserServices from '../service/User'
import { SUCCESS, NOT_FOUND, NOT_UNIQUE, Authorization } from '../constants'
import { DataNotFoundException, DataNotUniqueException } from '../exception'
// import {} from '../exception/User'
import authorization from '../middlewares/authorization'
const tag = tags(['User']) // eslint-disable-line no-unused-vars

export default class UserController {
  @request('GET', '/user')
  @summary('Get user')
  @query({
    type: { type: 'string', default: 'select', description: 'type' },
    start: { type: 'number', required: true, default: 0, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' }
  })
  @tag
  @middlewares(
    // authorization(['system'], Authorization.ADMIN)
  )
  @responses(schema.findUserResponses)
  static async findUser(ctx) {
    const userServices = new UserServices()
    const query = ctx.query
    try {
      const res = await userServices.findUser(query)
      return ctx.res.ok(res, SUCCESS.message)
    } catch (err) {
      ctx.log.error({ message: err.message, err })
      return ctx.res.internalServerError(err.name, err.message, { query })
    }
  }

  @request('GET', '/user/info')
  @summary('Get user')
  @tag
  @middlewares(
  )
  @responses(schema.findUserResponses)
  static async getUserInfo(ctx) {
    try {
      return ctx.res.ok(ctx.state.user, SUCCESS.message)
    } catch (err) {
      ctx.log.error({ message: err.message, err })
      return ctx.res.internalServerError(err.name, err.message, { query })
    }
  }

  @request('GET', '/user/{uuid}')
  @summary('Get user by uuid')
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
  @responses(schema.getUserByUuidResponses)
  static async getUserByUuid(ctx) {
    const userServices = new UserServices()
    const { uuid } = ctx.validatedParams

    const data = await userServices.getUser(uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('GET', '/user/{uuid}/review')
  @summary('Get review by user uuid')
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
  @responses(schema.getUserByUuidResponses)
  static async getReviewByUuid(ctx) {
    const { uuid } = ctx.validatedParams
    try {
      // const data = await userServices.get(uuid)
      return ctx.res.ok('data', SUCCESS.message)
    } catch (err) {
      if (err instanceof DataNotFoundException) {
        return ctx.res.notFound(NOT_FOUND.code, NOT_FOUND.message, { uuid })
      }
      if (err instanceof DataNotUniqueException) {
        return ctx.res.notFound(NOT_UNIQUE.code, NOT_UNIQUE.message, { uuid })
      }
      ctx.log.error({ message: err.message, err })
      return ctx.res.internalServerError(err.name, err.message, { uuid })
    }
  }
}
