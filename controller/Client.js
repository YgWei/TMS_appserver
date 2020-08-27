import { deprecated, request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import authorization from '../middlewares/authorization'
import * as schema from '../schema/Client'
import ClientServices from '../service/Client'
import { SUCCESS, Authorization } from '../constants'
const tag = tags(['Client']) // eslint-disable-line no-unused-vars

export default class ClientController {
  @request('GET', '/client/workcenter/{workCenterKey}/updateRecord')
  @summary('Find workcenter updateRecord data by workCenter key.')
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: '10', description: 'limit' }
  })
  @tag
  @path({
    workCenterKey: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN }
    ]),
    validate(schema.findWorkCenterUpdateRecordValidation)
  ])
  @responses(schema.findWorkCenterUpdateRecordResponses)
  static async findWorkCenterUpdateRecord(ctx) {
    const clientServices = new ClientServices()
    const query = ctx.query
    const { workCenterKey } = ctx.validatedParams

    const res = await clientServices.findWorkCenterUpdateRecord(workCenterKey, query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/client/workcenter/{workCenterKey}/template')
  @summary('Find workcenter template data by workCenter key.')
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: '10', description: 'limit' }
  })
  @tag
  @path({
    workCenterKey: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN }
    ]),
    validate(schema.findWorkCenterTemplateValidation)
  ])
  @responses(schema.findWorkCenterTemplateResponses)
  static async findWorkCenterTemplate(ctx) {
    const clientServices = new ClientServices()
    const query = ctx.query
    const { workCenterKey } = ctx.validatedParams

    const res = await clientServices.findWorkCenterTemplate(workCenterKey, query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/client/workcenter/{workCenterKey}/template/{templateKey}/updateRecord')
  @summary('Find template updateRecord data by template key.')
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: '10', description: 'limit' }
  })
  @tag
  @path({
    workCenterKey: { type: 'string', required: true },
    templateKey: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN }
    ]),
    validate(schema.findTemplateUpdateRecordValidation)
  ])
  @responses(schema.findTemplateUpdateRecordResponses)
  static async findWorkCenterTemplateUpdateRecord(ctx) {
    const clientServices = new ClientServices()
    const query = ctx.query
    const { workCenterKey, templateKey } = ctx.validatedParams

    const res = await clientServices.findWorkCenterTemplateUpdateRecord(workCenterKey, templateKey, query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('POST', '/client/updateRecord/{updateRecordKey}/updateStatus')
  @summary('update status of updateRecord for client request')
  @path({
    updateRecordKey: { type: 'string', required: true }
  })
  @tag
  @body({
    status: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN }
    ]),
    validate(schema.updateStatusOfUpdateRecordValidation)
  ])
  @responses(schema.updateStatusOfUpdateRecordResponses)
  static async updateStatus(ctx) {
    const clientServices = new ClientServices()
    const { updateRecordKey } = ctx.validatedParams
    const body = ctx.validatedBody
    const user = ctx.state.user

    const res = await clientServices.pullUpdateRecordStatus(updateRecordKey, body.status, user)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/client/updateRecord/{updateRecordKey}')
  @summary('Get updateRecord with tag by key.')
  @query({})
  @tag
  @path({
    updateRecordKey: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN }
    ]),
    validate(schema.getUpdateRecordStateValidation)
  ])
  @responses(schema.getUpdateRecordStateResponses)
  static async getUpdateRecordWithTag(ctx) {
    const clientServices = new ClientServices()
    const { updateRecordKey } = ctx.validatedParams

    const res = await clientServices.getUpdateRecordWithDeployment(updateRecordKey)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('PUT', '/client/updateRecordKey/{updateRecordKey}')
  @summary('start trace for client')
  @tag
  @path({
    updateRecordKey: { type: 'string', required: true }
  })
  @body({
    traceUuid: { type: 'string' },
    cloudStorageUuid: { type: 'string' }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN }
    ])
  ])
  @responses()
  static async putRenerResult(ctx) {
    const clientServices = new ClientServices()
    const { updateRecordKey } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const res = await clientServices.updateRenderResult(updateRecordKey, body, useruuid)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/client/preprocess/check')
  @summary('check data')
  @tag
  @query({
    company: { type: 'string', required: true, default: '', description: 'company uuid' },
    production: { type: 'string', required: true, default: '', description: 'production uuid' },
    version: { type: 'string', default: '', description: 'version' }
  })
  @middlewares(
    [validate(schema.checkDataValidate),
      authorization([{ group: ['system'], level: Authorization.ADMIN }])]
  )
  @responses(schema.checkDataResponses)
  static async clientPreprocessCheck(ctx) {
    const clientServices = new ClientServices()
    const query = ctx.query
    const user = ctx.state.user

    const res = await clientServices.preprocessCheck(query, user)
    const data = {
      version: res.data[0].deployment.tag,
      projectId: res.data[0].template.projectId,
      entrypoint: res.data[0].template.entryPoint,
      type: res.data[0].template.type
    }
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/client/ssmo/prprocess')
  @summary('start preprocess for client')
  @tag
  @body({
    updateRecordKey: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN }
    ])
  ])
  @responses()
  static async startPreprocess(ctx) {
    const clientServices = new ClientServices()
    const { updateRecordKey } = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const res = await clientServices.startPreprocess(updateRecordKey, useruuid)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('POST', '/client/ssmo/trace')
  @summary('start trace for client')
  @tag
  @body({
    updateRecordKey: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN }
    ])
  ])
  @responses()
  static async startTrace(ctx) {
    const clientServices = new ClientServices()
    const { updateRecordKey } = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const res = await clientServices.startTrace(updateRecordKey, useruuid)
    return ctx.res.ok(res, SUCCESS.message)
  }
}
