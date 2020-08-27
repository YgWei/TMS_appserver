import { request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/WorkCenter'
import WorkCenterServices from '../service/WorkCenter'
import TpWcService from '../service/TP_WC_rel'
import ProductOwnerService from '../service/ProductOwner'
import { Authorization } from '../constants'
import authorization from '../middlewares/authorization'
const tag = tags(['WorkCenter']) // eslint-disable-line no-unused-vars

export default class WorkCenterController {
  @request('GET', '/workcenter')
  @summary('Get workcenter')
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: '10', description: 'limit' },
    type: { type: 'string', required: true, default: 'all', description: 'type' }
  })
  @tag
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.findWorkCenterValidation)])
  @responses(schema.findWorkCenterResponses)
  static async findWorkCenter(ctx) {
    const workcenterServices = new WorkCenterServices()
    const start = ctx.query.start
    const limit = ctx.query.limit
    const query = {
      type: ctx.query.type
    }

    const res = await workcenterServices.findWorkCenter(start, limit, query)
    return ctx.res.ok(res, 'success get workcenter list')
  }

  @request('GET', '/workcenter/{uuid}')
  @summary('Get workcenter by uuid')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.getWorkCenterByUuidValidation)
  ])
  @responses(schema.getWorkCenterByUuidResponses)
  static async getWorkCenterByUuid(ctx) {
    const workcenterServices = new WorkCenterServices()
    const { uuid } = ctx.validatedParams

    const data = await workcenterServices.getWorkCenter(uuid)
    return ctx.res.ok(data, 'success get the targeted workcenter')
  }

  @request('POST', '/workcenter')
  @summary('create workcenter')
  @tag
  @body({
    name: { type: 'string', required: true },
    region: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.createWorkCenterValidation)
  ])
  @responses(schema.createWorkCenterResponses)
  static async createWorkCenter(ctx) {
    const workcenterServices = new WorkCenterServices()
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const data = await workcenterServices.createWorkCenter(body, useruuid)
    return ctx.res.ok(data, 'success get the targeted workcenter')
  }

  @request('PUT', '/workcenter/{uuid}')
  @summary('update workcenter')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @body({
    name: { type: 'string' },
    region: { type: 'string' }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.updateWorkCenterValidation)
  ])
  @responses(schema.updateWorkCenterResponses)
  static async updateWorkCenter(ctx) {
    const workcenterServices = new WorkCenterServices()
    const { uuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const data = await workcenterServices.updateWorkCenter(uuid, body, useruuid)
    return ctx.res.ok(data, 'success update the targeted workcenter')
  }

  @request('DELETE', '/workcenter/{uuid}')
  @summary('delete workcenter')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.deleteWorkCenterValidation)
  ])
  @responses(schema.deleteWorkCenterResponses)
  static async deleteWorkCenter(ctx) {
    const workcenterServices = new WorkCenterServices()
    const { uuid } = ctx.validatedParams
    const useruuid = ctx.state.user.uuid

    const data = await workcenterServices.invalid(uuid, useruuid)
    return ctx.res.ok(data, 'success delete the targeted workcenter')
  }

  @request('POST', '/workcenter/{workcenterUuid}/template')
  @summary('update workcenter template')
  @tag
  @path({
    workcenterUuid: { type: 'string', required: true }
  })
  @body({
    templateUuid: { type: 'string' }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.createWorkCenterTemplateValidation)
  ])
  @responses(schema.createWorkCenterTemplateResponses)
  static async createWorkCenterTemplate(ctx) {
    const tpWcService = new TpWcService()
    const { workcenterUuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const uuid = { workcenter: workcenterUuid, template: body.templateUuid }
    const useruuid = ctx.state.user.uuid

    const data = await tpWcService.createWorkCenter(uuid, useruuid)
    return ctx.res.ok(data, 'success create template into workcenter')
  }

  @request('DELETE', '/workcenter/{workcenterUuid}/template/{templateUuid}')
  @summary('delete workcenter template')
  @tag
  @path({
    workcenterUuid: { type: 'string', required: true },
    templateUuid: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.deketeWorkCenterTemplateValidation)
  ])
  @responses(schema.deketeWorkCenterTemplateResponses)
  static async deleteWorkCenterTemplate(ctx) {
    const tpWcService = new TpWcService()
    const { workcenterUuid, templateUuid } = ctx.validatedParams
    const uuid = { workcenter: workcenterUuid, template: templateUuid }
    const useruuid = ctx.state.user.uuid

    const data = await tpWcService.deleteWorkCenterTemplate(uuid, useruuid)
    return ctx.res.ok(data, 'success delete the targeted workcenter')
  }

  @request('POST', '/workcenter/{workCenterUuid}/productOwner')
  @summary('create productOwner')
  @tag
  @path({
    workCenterUuid: { type: 'string', required: true }
  })
  @body({
    name: { type: 'string', required: true },
    templateUuid: { type: 'string', required: true },
    email: { type: 'string', required: true },
    phone: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.createProductOwnerValidation)
  ])
  @responses(schema.createProductOwnerResponses)
  static async createWorkCenterProductOwner(ctx) {
    const productOwnerService = new ProductOwnerService()
    const { workCenterUuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid
    body.workCenterUuid = workCenterUuid

    const res = await productOwnerService.create(body, useruuid)
    return ctx.res.ok(res, 'success create ProductOwner')
  }

  @request('GET', '/workcenter/{workCenterUuid}/productOwner')
  @summary('Get productOwner')
  @path({
    workCenterUuid: { type: 'string', required: true }
  })
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: '10', description: 'limit' }
  })
  @tag
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.findProductOwnerValidation)])
  @responses(schema.findProductOwnerResponses)
  static async findWorkCenterProductOwner(ctx) {
    const productOwnerService = new ProductOwnerService()
    const { workCenterUuid } = ctx.validatedParams
    const query = ctx.query

    const data = {
      workCenterUuid,
      ...query
    }

    const res = await productOwnerService.findByWorkCenterUuid(data)
    return ctx.res.ok(res, 'success get ProductOwner list')
  }

  @request('GET', '/workcenter/{workCenterUuid}/template')
  @summary('Get workcenter template by uuid')
  @tag
  @path({
    workCenterUuid: { type: 'string', required: true }
  })
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: '10', description: 'limit' },
    type: { type: 'string', required: true, default: 'list', description: 'type' }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.getWorkCenterTemplateByUuidValidation)
  ])
  @responses(schema.getWorkCenterTemplateByUuidResponses)
  static async getWorkCenterTemplateByUuid(ctx) {
    const workcenterServices = new WorkCenterServices()
    const { workCenterUuid } = ctx.validatedParams
    const query = ctx.query

    query.workCenterUuid = workCenterUuid

    const workCentes = await workcenterServices.findWorkCenterTemplate(query)
    let res = {}
    res.count = workCentes.count
    if (query.type === 'list') {
      res.data = workCentes.data.map(item => {
        return {
          company: item.company.name,
          companyUuid: item.company._key,
          production: item.production.name,
          productionUuid: item.production._key,
          template: item.template.name,
          templateUuid: item.template._key
        }
      })
    } else {
      res = workCentes.data.map(item => {
        return {
          templateUuid: item.template._key,
          name: item.template.name
        }
      })
    }
    return ctx.res.ok(res, 'success get the targeted workcenter')
  }

  @request('DELETE', '/workcenter/{workCenterUuid}/productOwner/{uuid}')
  @summary('delete productOwner')
  @path({
    workCenterUuid: { type: 'string', required: true },
    uuid: { type: 'string', required: true, default: 'string', description: 'uuid' }
  })
  @tag
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.deleteProductOwnerValidation)])
  @responses(schema.deleteProductOwnerResponses)
  static async deleteWorkCenterProductOwner(ctx) {
    const productOwnerService = new ProductOwnerService()
    const { workCenterUuid, uuid } = ctx.validatedParams
    const useruuid = ctx.state.user.uuid
    const query = {
      workCenterUuid: workCenterUuid,
      uuid: uuid
    }

    const res = await productOwnerService.deleteByWorkCenterUuid(query, useruuid)
    return ctx.res.ok(res, 'success delete ProductOwner')
  }

  @request('PUT', '/workcenter/{workCenterUuid}/productOwner/{uuid}')
  @summary('update productOwner')
  @tag
  @path({
    workCenterUuid: { type: 'string', required: true },
    uuid: { type: 'string', required: true }
  })
  @body({
    templateUuid: { type: 'string', required: true },
    name: { type: 'string', required: true },
    email: { type: 'string', required: true },
    phone: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.updateProductOwnerValidation)
  ])
  @responses(schema.updateProductOwnerResponses)
  static async updateWorkCenterProductOwner(ctx) {
    const productOwnerService = new ProductOwnerService()
    const { workCenterUuid, uuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid
    body.workCenterUuid = workCenterUuid
    body.uuid = uuid

    const data = await productOwnerService.updateByByWorkCenterUuid(body, useruuid)
    return ctx.res.ok(data, 'success create ProductOwner')
  }

  @request('GET', '/workcenter/{workCenterUuid}/updateRecord')
  @summary('Get workcenter updateRecord data by uuid')
  @tag
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: '10', description: 'limit' }
  })
  @path({
    workCenterUuid: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.findUpdateRecordValidation)
  ])
  @responses(schema.getWorkCenterTemplateByUuidResponses)
  static async getWorkCenterUpdateRecordByUuid(ctx) {
    const workcenterServices = new WorkCenterServices()
    const { workCenterUuid } = ctx.validatedParams
    const query = {
      workcenterUuid: workCenterUuid,
      start: ctx.query.start,
      limit: ctx.query.limit
    }

    const updateRecords = await workcenterServices.findWorkCenterUpdateRecord(query)
    const res = {
      count: updateRecords.count,
      data: []
    }
    for (const item of updateRecords.data) {
      res.data.push({
        uuid: item.updateRecord._key,
        tpwcRelUuid: item.updateRecord.TP_WC_relKey,
        releaseUuid: item.deployment._key,
        startTime: item.updateRecord.startTime,
        state: item.updateRecord.status[item.updateRecord.status.length - 1],
        templateName: item.template.name,
        releaseVersion: item.deployment.tag

      })
    }
    return ctx.res.ok(res, 'success get the targeted UpdateRecord')
  }
}
