import {
  request,
  summary,
  tags,
  responses,
  body,
  middlewares,
  path,
  query
} from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/Company'
import * as productionSchema from '../schema/Production'
import CompanyServices from '../service/Company'
import ProductionServices from '../service/Production'
import { SUCCESS, Authorization } from '../constants'
import Joi from '@hapi/joi'
import authorization from '../middlewares/authorization'
const tag = tags(['Company']) // eslint-disable-line no-unused-vars

export default class CompanyController {
  @request('GET', '/company')
  @summary('Get company')
  @query({
    start: { type: 'number', required: true, default: 0, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' },
    name: { type: 'string', required: false, default: '', description: 'CompanyName' },
    type: { type: 'string', required: false, default: 'all', description: 'type' }
  })
  @tag
  @middlewares(
    [validate({
      query: Joi.object({
        start: Joi.number().required(),
        limit: Joi.number().required(),
        name: Joi.string(),
        type: Joi.string()
      })
    }),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])])
  @responses(schema.findCompanyResponses)
  static async findCompany(ctx) {
    const companyServices = new CompanyServices()
    const query = ctx.query

    const res = await companyServices.findCompany(query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/company/{uuid}')
  @summary('Get company by uuid')
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
  @responses(schema.getCompanyByUuidResponses)
  static async getCompanyByUuid(ctx) {
    const companyServices = new CompanyServices()
    const { uuid } = ctx.validatedParams

    const data = await companyServices.getCompany(uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/company')
  @summary('create company')
  @tag
  @body(schema.createCompany)
  @middlewares(
    [authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.createCompanyValidation)]
  )
  @responses(schema.createCompanyResponses)
  static async createCompany(ctx) {
    const companyServices = new CompanyServices()
    const body = ctx.validatedBody
    const user = ctx.state.user

    const data = await companyServices.createCompany(body, user)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('PUT', '/company/{uuid}')
  @summary('update company')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @body(schema.updateCompany)
  @middlewares(
    [authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.updateCompanyValidation)]
  )
  @responses(schema.updateCompanyResponses)
  static async updateCompany(ctx) {
    const companyServices = new CompanyServices()
    const { uuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const data = await companyServices.updateCompany(uuid, body, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('GET', '/company/{companyUuid}/production')
  @summary('Get company productions')
  @query({
    start: { type: 'number', required: true, default: 0, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' },
    name: { type: 'string', required: false, default: '', description: 'productionName' },
    type: { type: 'string', required: true, default: 'all', description: 'type' }
  })
  @tag
  @path({
    companyUuid: { type: 'string', required: true }
  })
  @middlewares(
    [validate({
      query: Joi.object({
        start: Joi.number().required(),
        limit: Joi.number().required(),
        name: Joi.string(),
        type: Joi.string()
      })
    }),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])]
  )
  @responses(productionSchema.findProductionResponses)
  static async findProductions(ctx) {
    const productionServices = new ProductionServices()
    const { companyUuid } = ctx.validatedParams
    const query = ctx.query

    const res = await productionServices.findProduction(companyUuid, query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/company/{companyUuid}/production/{productionUuid}')
  @summary('Get production by uuid')
  @tag
  @path({
    companyUuid: { type: 'string', required: true },
    productionUuid: { type: 'string', required: true }
  })
  @middlewares(
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  )
  @responses(productionSchema.getProductionByUuidResponses)
  static async getProductionByUuid(ctx) {
    const productionServices = new ProductionServices()
    const { productionUuid } = ctx.validatedParams

    const data = await productionServices.getProduction(productionUuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/company/{companyUuid}/production')
  @summary('create production')
  @tag
  @path({
    companyUuid: { type: 'string', required: true }
  })
  @body({
    name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    }
  })
  @middlewares(
    [authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate({
      body: Joi.object({
        description: Joi.string().required(),
        name: Joi.string().required()
      })
    })]
  )
  @responses(productionSchema.createProductionResponses)
  static async createProduction(ctx) {
    const productionServices = new ProductionServices()
    const { companyUuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const data = await productionServices.createProduction(companyUuid, body, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('PUT', '/company/{companyUuid}/production/{productionUuid}')
  @summary('update production')
  @tag
  @path({
    companyUuid: { type: 'string', required: true },
    productionUuid: { type: 'string', required: true }
  })
  @body({
    name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    }
  })
  @middlewares(
    [authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate({
      body: Joi.object({
        description: Joi.string().required(),
        name: Joi.string().required()
      })
    })]
  )
  @responses(productionSchema.updateProductionResponses)
  static async updateProduction(ctx) {
    const productionServices = new ProductionServices()
    const { productionUuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const res = await productionServices.updateProduction(productionUuid, body, useruuid)
    return ctx.res.ok(res, SUCCESS.message)
  }
}
