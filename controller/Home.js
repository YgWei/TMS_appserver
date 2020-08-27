import { request, summary, tags, responses } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
import pkginfo from '../package.json'
import CompanyServices from '../service/Company'
const tag = tags(['Home']) // eslint-disable-line no-unused-vars

export default class HomeController {
  @request('get', '/home')
  @summary('Show API information')
  @tag
  @responses({
    200: {
      description: 'Describe general API information'
    }
  })
  static async welcome(ctx) {
    // BUSINESS LOGIC
    const data = {
      name: pkginfo.name,
      version: pkginfo.version,
      description: pkginfo.description,
      author: pkginfo.author
    }

    ctx.body = {
      message: 'hello home here'
    }
    ctx.res.ok(data, 'success')
  }

  @request('get', '/health')
  @summary('health')
  @tag
  @responses({
    200: {}
  })
  static async health(ctx) {
    const com = new CompanyServices()
    await com.get('1')
    ctx.res.ok('', '')
  }
}
