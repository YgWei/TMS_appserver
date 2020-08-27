import { request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/Release'
import ReleaseServices from '../service/Release'
import UpdateRecordServices from '../service/UpdateRecord'
import { SUCCESS, Authorization } from '../constants'
// import {} from '../exception/Release'
import authorization from '../middlewares/authorization'
const tag = tags(['Release']) // eslint-disable-line no-unused-vars

export default class ReleaseController {
  @request('GET', '/release')
  @summary('Get release')
  @query({
    start: { type: 'number', required: true, default: 0, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' },
    templateUuid: { type: 'string', description: 'templateUuid' }
  })
  @tag
  @middlewares([
    validate(schema.findReleaseValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.findReleaseResponses)
  static async findRelease(ctx) {
    const releaseServices = new ReleaseServices()
    const start = ctx.query.start
    const limit = ctx.query.limit
    const templateKey = ctx.query.templateUuid

    const res = await releaseServices.findRelease(templateKey, start, limit)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/release/tree')
  @summary('Get release tree')
  @query({
    select: { type: 'string', required: true },
    companyUuid: { type: 'string' },
    productionUuid: { type: 'string' },
    templateUuid: { type: 'string' },
    deploymentUuid: { type: 'string' },
    dataUuid: { type: 'string' }
  })
  @tag
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.releaseTreeValidation)
  ])
  static async getReleaseTree(ctx) {
    const releaseServices = new ReleaseServices()
    const query = ctx.query
    const res = await releaseServices.getReleaseTree(query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/release/{uuid}')
  @summary('Get release by uuid')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    validate(schema.getReleaseByUuidValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.getReleaseByUuidResponses)
  static async getReleaseByUuid(ctx) {
    const releaseServices = new ReleaseServices()
    const { uuid } = ctx.validatedParams
    const data = await releaseServices.getRelease(uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/release')
  @summary('create release')
  @tag
  @body(schema.createRelease)
  @middlewares([
    validate(schema.createReleaseValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.createReleaseResponses)
  static async createRelease(ctx) {
    const releaseServices = new ReleaseServices()
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const data = await releaseServices.createRelease(body.deploymentUuid, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/v2/release')
  @summary('create release')
  @tag
  @body(schema.createReleaseV2)
  @middlewares([
    validate(schema.createReleaseV2Validation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.createReleaseResponses)
  static async createReleaseV2(ctx) {
    const releaseServices = new ReleaseServices()
    const updaterecordServices = new UpdateRecordServices()
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const release = await releaseServices.createRelease(body.deploymentUuid, useruuid)
    const data = {
      workCenters: body.workCenters,
      releaseUuid: body.deploymentUuid,
      templateUuid: body.templateUuid,
      startTime: body.startTime,
      note: body.note
    }
    const updateRecord = await updaterecordServices.createTemplate(data, useruuid)
    return ctx.res.ok({ release, updateRecord }, SUCCESS.message)
  }
}
