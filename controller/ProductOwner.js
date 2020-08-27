import { request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/ProductOwner'
import ProductOwnerServices from '../service/ProductOwner'
import { SUCCESS, Authorization } from '../constants'
// import {} from '../exception/ProductOwner'
import authorization from '../middlewares/authorization'
const tag = tags(['ProductOwner']) // eslint-disable-line no-unused-vars

export default class ProductOwnerController {
  @request('GET', '/productowner')
  @summary('Get productowner')
  @query({
    start: { type: 'number', required: true, default: '0', description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' }
  })
  @tag
  @middlewares(
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  )
  @responses(schema.findProductOwnerResponses)
  static async findProductOwner(ctx) {
    const productownerServices = new ProductOwnerServices()
    const { start, limit } = ctx.query

    const res = await productownerServices.findProductOwner(start, limit)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/productowner/{uuid}')
  @summary('Get productowner by uuid')
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
  @responses(schema.getProductOwnerByUuidResponses)
  static async getProductOwnerByUuid(ctx) {
    const productownerServices = new ProductOwnerServices()
    const { uuid } = ctx.validatedParams

    const data = await productownerServices.get(uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/productowner')
  @summary('create productowner')
  @tag
  @body(schema.createProductOwner)
  @middlewares(
    [authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.createProductOwnerValidation)]
  )
  @responses(schema.createProductOwnerResponses)
  static async createProductOwner(ctx) {
    const productownerServices = new ProductOwnerServices()
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const data = await productownerServices.create(body, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('PUT', '/productowner/{uuid}')
  @summary('update productowner')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @body({

  })
  @middlewares(
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  )
  @responses(schema.updateProductOwnerResponses)
  static async updateProductOwner(ctx) {
    const productownerServices = new ProductOwnerServices()
    const { uuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const data = await productownerServices.update(uuid, body, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('DELETE', '/productowner/{uuid}')
  @summary('delete productowner')
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
  @responses(schema.deleteProductOwnerResponses)
  static async deleteProductOwner(ctx) {
    const productownerServices = new ProductOwnerServices()
    const { uuid } = ctx.validatedParams
    const useruuid = ctx.state.user.uuid

    const data = await productownerServices.invalid(uuid, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }
}
