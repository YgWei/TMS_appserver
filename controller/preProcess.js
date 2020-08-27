import {
  request,
  summary,
  tags,
  responses,
  middlewares,
  query
} from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/PreProcess'
import PreProcessServices from '../service/PreProcess'
import { SUCCESS, Authorization } from '../constants'
import authorization from '../middlewares/authorization'
const tag = tags(['PreProcess']) // eslint-disable-line no-unused-vars

export default class SyncController {
      @request('GET', '/preprocess/check')
      @summary('check data')
      @tag
      @query({
        company: { type: 'string', required: true, default: '', description: 'company uuid' },
        production: { type: 'string', required: true, default: '', description: 'production uuid' },
        version: { type: 'string', default: '', description: 'version' }
      })
      @middlewares(
        [validate(schema.checkDataValidate),
          authorization([{ group: ['belstar'], level: Authorization.ADMIN }])]
      )
      @responses(schema.checkDataResponses)
  static async findSyncTemplate(ctx) {
    const preProcessServices = new PreProcessServices()
    const query = ctx.query

    const res = await preProcessServices.preProcess(query)
    const data = {
      version: res.data[0].deployment.tag,
      projectId: res.data[0].template.projectId,
      entrypoint: res.data[0].template.entryPoint,
      type: res.data[0].template.type
    }
    return ctx.res.ok(data, SUCCESS.message)
  }
}
