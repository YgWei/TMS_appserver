import {
  request,
  summary,
  tags,
  path,
  responses,
  middlewares,
  query
} from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/Gitlab'
import GitlabService from '../util/gitlab'
import { SUCCESS, Authorization } from '../constants'
import authorization from '../middlewares/authorization'
const tag = tags(['Gitlab']) // eslint-disable-line no-unused-vars

export default class CompanyController {
  @request('GET', '/gitlab/projects')
  @summary('Get projects')
  @query({
    start: { type: 'number', required: true, default: 0, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' }
  })
  @tag
  @middlewares([
    validate(schema.findProjectsValidate),
    authorization([
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.findProjectsResponses)
  static async findProjects(ctx) {
    const gitlabService = new GitlabService()
    const user = ctx.state.user
    const query = ctx.query
    try {
      const projects = await gitlabService.getProjects(user.gitlab.access_token)
      const res = projects.slice(Number(query.start), Number(query.start) + Number(query.limit))

      return ctx.res.ok({ count: res.length, res }, SUCCESS.message)
    } catch (err) {
      ctx.log.error({ message: err.message, err })
      return ctx.res.internalServerError(err.name, err.message, { query })
    }
  }

  @request('GET', '/gitlab/branches/{projectId}')
  @summary('Get branch')
  @path({
    projectId: { type: 'number', required: true }
  })
  @query({
    start: { type: 'number', required: true, default: 0, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' }
  })
  @tag
  @middlewares([
    validate(schema.findBranchesValidate),
    authorization([
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.findBranchesResponses)
  static async findBranch(ctx) {
    const gitlabService = new GitlabService()
    const user = ctx.state.user
    const { projectId } = ctx.validatedParams
    const query = ctx.query
    try {
      const branches = await gitlabService.getBranches(user.gitlab.access_token, projectId)
      const res = branches.slice(Number(query.start), Number(query.start) + Number(query.limit))

      return ctx.res.ok({ count: res.length, res }, SUCCESS.message)
    } catch (err) {
      ctx.log.error({ message: err.message, err })
      return ctx.res.internalServerError(err.name, err.message, { query })
    }
  }

  @request('POST', '/gitlab/tag/{projectId}')
  @summary('create tag')
  @query({
    tag: { type: 'string', required: true },
    commitId: { type: 'string', required: true }
  })
  @path({
    projectId: { type: 'number', required: true }
  })
  @tag
  @middlewares([
    validate(schema.createTagValidate),
    authorization([
      { group: ['gitlab'], level: Authorization.ADMIN }
    ])
  ])
  @responses(schema.findBranchesResponses)
  static async createTag(ctx) {
    const gitlabService = new GitlabService()
    const user = ctx.state.user
    const { projectId } = ctx.validatedParams
    const query = ctx.query
    try {
      const branches = await gitlabService.createTag(user.gitlab.access_token, projectId, query)

      return ctx.res.ok({ branches }, SUCCESS.message)
    } catch (err) {
      ctx.log.error({ message: err.message, err })
      return ctx.res.internalServerError(err.name, err.message, { query })
    }
  }
}
