import {
  request,
  summary,
  tags,
  responses,
  middlewares,
  query
} from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import validate from '../middlewares/validate'
import * as schema from '../schema/Sync'
import SyncServices from '../service/Sync'
import ReleaseServices from '../service/Release'
import { SUCCESS, Authorization } from '../constants'
import authorization from '../middlewares/authorization'
const tag = tags(['Sync']) // eslint-disable-line no-unused-vars

export default class SyncController {
    @request('GET', '/sync/template')
    @summary('Get template')
    @tag
    @middlewares(
      authorization([{ group: ['belstar'], level: Authorization.ADMIN },
        { group: ['gitlab'], level: Authorization.ADMIN }])
    )
    @responses(schema.findTemplateResponses)
  static async findSyncTemplate(ctx) {
    const syncServices = new SyncServices()
    const query = ctx.query
    const workCenter = ctx.state.user.userInfo.wokerCenter
    try {
      const aqlQuery = `FOR template IN Template
        FILTER template.uuid IN (FOR wc IN TP_WC_rel
        FILTER wc.workCenterUuid == '${workCenter.uuid}'
        RETURN wc.templateUuid)
        RETURN template`
      const templates = await syncServices.executeAQL(aqlQuery)
      const data = templates.map(item => {
        return {
          uuid: item.uuid,
          name: item.name
        }
      })
      return ctx.res.ok(data, SUCCESS.message)
    } catch (err) {
      ctx.log.error({ message: err.message, err })
      return ctx.res.internalServerError(err.name, err.message, { query })
    }
  }

  @request('GET', '/sync/release')
  @summary('Get release')
  @tag
  @query({
    templateuuid: { type: 'string', required: true, default: '', description: 'template uuid' }
  })
  @middlewares(
    [validate(schema.findReleaseValidate),
      authorization([{ group: ['belstar'], level: Authorization.ADMIN },
        { group: ['gitlab'], level: Authorization.ADMIN }])]
  )
  @responses(schema.findReleaseResponses)
    static async findSyncRelease(ctx) {
      const releaseServices = new ReleaseServices()
      const query = ctx.query
      try {
        const res = await releaseServices.findByTemplareUUID(query.templateuuid)
        return ctx.res.ok(res, SUCCESS.message)
      } catch (err) {
        ctx.log.error({ message: err.message, err })
        return ctx.res.internalServerError(err.name, err.message, { query })
      }
    }
}
