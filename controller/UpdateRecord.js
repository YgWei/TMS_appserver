import { request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
// import validate from '../middlewares/validate'
import * as schema from '../schema/UpdateRecord'
import validate from '../middlewares/validate'
import UpdateRecordServices from '../service/UpdateRecord'
import { SUCCESS, Authorization } from '../constants'
// import {} from '../exception/UpdateRecord'
import authorization from '../middlewares/authorization'
const tag = tags(['UpdateRecord']) // eslint-disable-line no-unused-vars

export default class UpdateRecordController {
  @request('GET', '/updaterecord')
  @summary('Get updaterecord')
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' }
  })
  @tag
  @middlewares([
    validate(schema.getUpdateRecordValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.findUpdateRecordResponses)
  static async findUpdateRecord(ctx) {
    const updaterecordServices = new UpdateRecordServices()
    const query = ctx.query
    query.invalid = null
    const res = await updaterecordServices.findUpdateRecord(query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/updaterecord/{uuid}')
  @summary('Get updaterecord by uuid')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    validate(schema.getUpdateRecordByUuidValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.getUpdateRecordByUuidResponses)
  static async getUpdateRecordByUuid(ctx) {
    const updaterecordServices = new UpdateRecordServices()
    const { uuid } = ctx.validatedParams

    const data = await updaterecordServices.findUpdateRecordByUuid(uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/updaterecord')
  @summary('create updaterecord')
  @tag
  @body({
    templateUuid: { type: 'string', required: true },
    releaseUuid: { type: 'string', required: true },
    workCenters: { type: 'array', required: true, items: { type: 'string', required: true } },
    startTime: { type: 'string', required: true },
    note: { type: 'string', required: true }
  })
  @middlewares([
    validate(schema.createUpdateRecordValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.createUpdateRecordResponses)
  static async createUpdateRecord(ctx) {
    const updaterecordServices = new UpdateRecordServices()
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const data = await updaterecordServices.createTemplate(body, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }
}
