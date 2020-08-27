import { request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/Deployment'
import DeploymentServices from '../service/Deployment'
import ReviewServices from '../service/Review'
import { SUCCESS, Authorization } from '../constants'
// import {} from '../exception/Deployment'
import authorization from '../middlewares/authorization'
const tag = tags(['Deployment']) // eslint-disable-line no-unused-vars

export default class DeploymentController {
  @request('GET', '/deployment')
  @summary('Get deployment')
  @query({
    start: { type: 'number', required: true, default: 0, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' },
    type: { type: 'string', default: 'all', description: 'type' },
    templateUuid: { type: 'string', description: 'templateUuid' },
    status: { type: 'string', description: 'check the last status is ..., value: [review_accept]' }
  })
  @tag
  @middlewares([
    validate(schema.getDeploymentValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.findDeploymentResponses)
  static async findDeployment(ctx) {
    const deploymentServices = new DeploymentServices()
    const query = ctx.query

    const res = await deploymentServices.findDeployment(query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/deployment/tag/find')
  @summary('Get tag')
  @query({
    templateUuid: { type: 'string', required: true, description: 'templateUuid' },
    tag: { type: 'string', required: true, description: 'tag' }
  })
  @tag
  @middlewares([
    validate(schema.getTagValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.findDeploymentResponses)
  static async findDeploymentTag(ctx) {
    const deploymentServices = new DeploymentServices()
    const query = ctx.query
    const user = ctx.state.user

    const res = await deploymentServices.findTag(user.gitlab.access_token, query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/deployment/{uuid}')
  @summary('Get deployment by uuid')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    validate(schema.getDeploymentByUuidValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.getDeploymentByUuidResponses)
  static async getDeploymentByUuid(ctx) {
    const deploymentServices = new DeploymentServices()
    const { uuid } = ctx.validatedParams

    const data = await deploymentServices.getDeployment(uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/deployment')
  @summary('create deployment')
  @tag
  @body(schema.createDeployment)
  @middlewares([
    validate(schema.createDeploymentValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.createDeploymentResponses)
  static async createDeployment(ctx) {
    const deploymentServices = new DeploymentServices()
    const body = ctx.validatedBody
    const user = ctx.state.user
    const data = await deploymentServices.createDeployment(user.gitlab.access_token, body, user)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('PUT', '/deployment/{uuid}')
  @summary('update deployment')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @body(schema.updateDeployment)
  @middlewares([
    validate(schema.updateDeploymentValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.updateDeploymentResponses)
  static async updateDeployment(ctx) {
    const deploymentServices = new DeploymentServices()
    const { uuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid

    const res = await deploymentServices.updateDeployment(uuid, body, useruuid)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('DELETE', '/deployment/{uuid}')
  @summary('delete deployment')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    validate(schema.deleteDeploymentValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.deleteDeploymentResponses)
  static async deleteDeployment(ctx) {
    const deploymentServices = new DeploymentServices()
    const { uuid } = ctx.validatedParams
    const data = await deploymentServices.invalid(uuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/deployment/{uuid}/review')
  @summary('Initiate review')
  @tag
  @path({ uuid: { type: 'string', required: true } })
  @body(schema.initiateReviewDeployment)
  @middlewares([
    validate(schema.initiateReviewValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.initiateReviewResponses)
  static async initReview(ctx) {
    const reviewServices = new ReviewServices()
    const { uuid } = ctx.validatedParams
    const body = ctx.validatedBody
    const useruuid = ctx.state.user.uuid
    const data = await reviewServices.startReview(uuid, body, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/deployment/{uuid}/deploy')
  @summary('update deploy status')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @body({})
  @middlewares([
    validate(schema.updateDeployStatusValidation),
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.updateDeploymentResponses)
  static async updateDeployStatus(ctx) {
    const deploymentServices = new DeploymentServices()
    const { uuid } = ctx.validatedParams
    const user = ctx.state.user

    const data = await deploymentServices.deployInitiate(uuid, user)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/deployment/deploy/success')
  @summary('update deploy status')
  @tag
  @body({
    projectId: { type: 'string', required: true },
    tag: { type: 'string', required: true }
  })
  @responses(schema.updateDeploymentResponses)
  static async updateDeployStatusSuccess(ctx) {
    const deploymentServices = new DeploymentServices()
    const { projectId, tag } = ctx.validatedBody
    const data = await deploymentServices.deploySuccess(projectId, tag)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('GET', '/deployment/{uuid}/renderResult')
  @summary('get renderResult')
  @tag
  @path({
    uuid: { type: 'string', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.updateDeploymentResponses)
  static async getRenderResult(ctx) {
    const { uuid } = ctx.validatedParams
    const useruuid = ctx.state.user.uuid
    const deploymentServices = new DeploymentServices()
    const data = await deploymentServices.deployRenderResult(uuid, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('POST', '/deployment/{uuid}/review/result')
  @summary('review result')
  @tag
  @path({ uuid: { type: 'string', required: true } })
  @body({
    result: { type: 'boolean', required: true }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.initiateReviewResponses)
  static async setReviewResult(ctx) {
    const reviewServices = new ReviewServices()
    const { uuid } = ctx.validatedParams
    const { result } = ctx.validatedBody
    const useruuid = ctx.state.user.uuid
    const data = await reviewServices.setReviewResult(uuid, result, useruuid)
    return ctx.res.ok(data, SUCCESS.message)
  }

  @request('GET', '/deployment/{uuid}/reviewRecord')
  @summary('review result')
  @tag
  @path({ uuid: { type: 'string', required: true } })
  @query({
    start: { type: 'number', required: true, default: 0, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' },
    group: { type: 'string', required: true, description: 'reviewUser, reviewGroup, customer' }
  })
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.getDeploymentReviewRecord)
  static async getDeploymentRenderResult(ctx) {
    const deploymentServices = new DeploymentServices()
    const { uuid } = ctx.validatedParams
    const query = ctx.query
    const data = await deploymentServices.getRenderResult(uuid, query)
    return ctx.res.ok(data, SUCCESS.message)
  }
}
