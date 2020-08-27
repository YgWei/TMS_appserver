import {
  request,
  summary,
  tags,
  responses,
  formData,
  middlewares,
  path,
  query
} from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import RenderTest from '../service/RenderTest'
import { SUCCESS } from '../constants'
import Joi from '@hapi/joi'
import * as schema from '../schema/RenderTest'
const tag = tags(['RenderTest']) // eslint-disable-line no-unused-vars

export default class RenderTestController {
  @request('GET', '/renderTest')
  @summary('Get renderTest')
  @query({
    start: { type: 'number', required: true, default: 0, description: 'start' },
    limit: { type: 'number', required: true, default: 10, description: 'limit' }
  })
  @tag
  @middlewares(
    [validate({
      query: Joi.object({
        start: Joi.number().required(),
        limit: Joi.number().required()
      })
    })])
  @responses(schema.findRenderTestResponses)
  static async findRenderTest(ctx) {
    const renderTestServices = new RenderTest()
    const query = ctx.query

    const res = await renderTestServices.find(query)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('GET', '/renderTest/{uuid}')
  @summary('Get renderTest')
  @path({
    uuid: { type: 'string', required: true }
  })
  @tag
  @responses(schema.getRenderTestResponses)
  static async getRenderTest(ctx) {
    const renderTestServices = new RenderTest()
    const { uuid } = ctx.validatedParams

    const res = await renderTestServices.get(uuid)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('POST', '/renderTest')
  @summary('Create renderTest')
  @formData({
    deploymentKey: { type: 'string', required: true, description: 'deploymentKey' },
    file: { type: 'file', required: true, description: 'upload file' }
  })
  @tag
  @responses(schema.createRenderTestResponses)
  static async createRenderTest(ctx) {
    const renderTestServices = new RenderTest()
    const body = ctx.request.body
    const file = ctx.request.files.file
    const useruuid = ctx.state.user.uuid

    const res = await renderTestServices.createRenderTest(body, file, useruuid)
    return ctx.res.ok(res, SUCCESS.message)
  }

  @request('POST', '/renderTest/{uuid}/trace')
  @summary('Get renderTest')
  @path({
    uuid: { type: 'string', required: true }
  })
  @tag
  @responses(schema.traceRenderTestResponses)
  static async traceRenderTest(ctx) {
    const renderTestServices = new RenderTest()
    const { uuid } = ctx.validatedParams
    const useruuid = ctx.state.user.uuid

    const res = await renderTestServices.trace(uuid, useruuid)
    return ctx.res.ok(res, SUCCESS.message)
  }
}
