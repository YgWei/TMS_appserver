import { request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/Review'
import ReviewServices from '../service/Review'
import { SUCCESS, Authorization } from '../constants'
// import {} from '../exception/Notify'
import authorization from '../middlewares/authorization'
// import logger from '../logger/develop'
// import { JsonWebTokenError } from 'jsonwebtoken'
const tag = tags(['Review']) // eslint-disable-line no-unused-vars

export default class NotifyController {
  @request('POST', '/review/{uuid}/reviewGroup')
  @summary('add reviewGroup.')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @body({
    userUuid: { type: 'array',
      required: true,
      items: {
        type: 'string', required: true, example: 'uuid'
      }
    }
  })
  @middlewares(
    [authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.addReviewGroupValidation)]
  )
  @responses(schema.addReviewGroupResponses)
  static async addReviewGroup(ctx) {
    const reviewServices = new ReviewServices()
    const { uuid } = ctx.validatedParams
    const userUuids = ctx.validatedBody.userUuid
    const user = ctx.state.user

    const res = await reviewServices.addReviewGroup(uuid, userUuids, user)
    return ctx.res.ok({ reviewGroup: res.reviewGroup }, SUCCESS.message)
  }
}
