import { request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/Template'
import TemplateServices from '../service/Template'
import { SUCCESS, Authorization } from '../constants'
// import {} from '../exception/Template'
import authorization from '../middlewares/authorization'
const tag = tags(['Template']) // eslint-disable-line no-unused-vars

export default class TemplateController {
  @request('GET', '/template')
  @summary('Get template')
  @query({
    start: { type: 'number', required: true, default: 0, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' },
    type: { type: 'string', default: 'all', description: 'type' },
    name: { type: 'string', description: 'search key' },
    companyUuid: { type: 'string', description: 'search key' },
    productionUuid: { type: 'string', description: 'search key' }
  })
  @tag
  @middlewares([
    validate(schema.findTemplateValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.findTemplateResponses)
  static async findTemplate(ctx) {
    const templateServices = new TemplateServices()
    const query = ctx.query
    const res = await templateServices.findTemplate(query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/template/{uuid}')
  @summary('Get template by uuid')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    validate(schema.getTemplateByUuidValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.getTemplateByUuidResponses)
  static async getTemplateByUuid(ctx) {
    const templateServices = new TemplateServices()
    const { uuid } = ctx.validatedParams

    const data = await templateServices.getTemplate(uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/template')
  @summary('create template')
  @tag
  @body(schema.createTemplate)
  @middlewares([
    validate(schema.createTemplateValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.createTemplateResponses)
  static async createTemplate(ctx) {
    const templateServices = new TemplateServices()
    const body = ctx.validatedBody
    const user = ctx.state.user
    const data = await templateServices.createTemplate(user.gitlab.access_token, body, user.uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('PUT', '/template/{uuid}')
  @summary('update template')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @body(schema.updateTemplate)
  @middlewares([
    validate(schema.updateTemplateValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.updateTemplateResponses)
  static async updateTemplate(ctx) {
    const templateServices = new TemplateServices()
    const { uuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const user = ctx.state.user

    const data = await templateServices.updateTemplate(uuid, body, user.uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('DELETE', '/template/{uuid}')
  @summary('delete template')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    validate(schema.deleteTemplateValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.deleteTemplateResponses)
  static async deleteTemplate(ctx) {
    const templateServices = new TemplateServices()
    const { uuid } = ctx.validatedParams
    const useruuid = ctx.state.user.uuid
    const data = await templateServices.invalid(uuid, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('GET', '/template/{templateUuid}/workcenter')
  @summary('Get template\'s workcenter')
  @query({
    start: { type: 'number', required: true, default: 1, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' }
  })
  @path({
    templateUuid: { type: 'string', required: true, description: 'templateUuid' }
  })
  @tag
  @middlewares([
    validate(schema.findTemplateValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.findTemplateResponses)
  static async findWorkcenterByTemplate(ctx) {
    const templateServices = new TemplateServices()
    const query = ctx.query
    const { templateUuid } = ctx.validatedParams

    const res = await templateServices.findTemplateByWorkcenter(templateUuid, query)
    return ctx.res.ok(res, SUCCESS.message)
  }
}
