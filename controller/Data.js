import { request, summary, tags, responses, body, middlewares, path, query, formData } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/Data'
import DataServices from '../service/Data'
import { SUCCESS, Authorization } from '../constants'
// import {} from '../exception/Data'
import authorization from '../middlewares/authorization'
const tag = tags(['Data']) // eslint-disable-line no-unused-vars

export default class DataController {
  @request('GET', '/data')
  @summary('Get data')
  @query({
    start: { type: 'number', required: true, default: 1, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' },
    type: { type: 'string', required: true, default: 'all', description: 'type' },
    name: { type: 'string', description: 'search key' },
    companyUuid: { type: 'string', description: 'search key' },
    productionUuid: { type: 'string', description: 'search key' }
  })
  @tag
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.findDataValidation)
  ])
  @responses(schema.findDataResponses)
  static async findData(ctx) {
    const dataServices = new DataServices()
    const query = ctx.query

    const res = await dataServices.findData(query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/data/{uuid}')
  @summary('Get data by uuid')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.getDataByUuidValidation)
  ])
  @responses(schema.getDataByUuidResponses)
  static async getDataByUuid(ctx) {
    const dataServices = new DataServices()
    const { uuid } = ctx.validatedParams

    const data = await dataServices.getData(uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/data')
  @summary('create data')
  @tag
  @formData(schema.createData)
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
    // validate(schema.createDataValidation)
  ])
  @responses(schema.createDataResponses)
  static async createData(ctx) {
    const dataServices = new DataServices()
    const body = ctx.request.body
    const useruuid = ctx.state.user.uuid
    const file = ctx.request.files.file

    const res = await dataServices.createData(body, file, useruuid)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('PUT', '/data/{uuid}')
  @summary('update data')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @body(schema.updateData)
  @middlewares([
    validate(schema.updateDataValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.updateDataResponses)
  static async updateData(ctx) {
    const dataServices = new DataServices()
    const { uuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const data = await dataServices.updateData(uuid, body, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('DELETE', '/data/{uuid}')
  @summary('delete data')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.deleteDataValidation)
  ])
  @responses(schema.deleteDataResponses)
  static async deleteData(ctx) {
    const dataServices = new DataServices()
    const { uuid } = ctx.validatedParams
    const useruuid = ctx.state.user.uuid

    const data = await dataServices.invalid(uuid, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }
}
