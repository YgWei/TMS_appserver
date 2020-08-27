import { request, summary, tags, responses, body, middlewares, path, query } from 'koa-swagger-decorator' // eslint-disable-line no-unused-vars
// import validate from '../middlewares/validate'
import * as schema from '../schema/Login'
import LoginService from '../service/Login'
import logger from '../logger/develop'
import validate from '../middlewares/validate'
import authorization from '../middlewares/authorization'
import { Authorization } from '../constants'
const tag = tags(['Login']) // eslint-disable-line no-unused-vars

export default class LoginController {
  @request('post', '/login/system')
  @body({
    account: { type: 'string', require: true },
    password: { type: 'string', require: true }
  })
  @summary('login')
  @middlewares(
    // validate(schema.loginValidate)
  )
  @tag
  @responses(schema.loginResponses)
  static async login(ctx) {
    const loginService = new LoginService()
    const body = ctx.validatedBody
    try {
      const token = await loginService.login(body)
      return ctx.res.ok({ jwt: token }, 'success')
    } catch (err) {
      logger.error({ message: err.message, data: body, err })
      return ctx.res.forbidden(err.name, 'Login fail.', 'Login fail.')
    }
  }

  @request('POST', '/login/client')
  @body({
    account: { type: 'string', require: true },
    password: { type: 'string', require: true }
  })
  @summary('login for client system')
  @tag
  @middlewares([
    authorization([
      { group: ['system'], level: Authorization.ADMIN },
      { group: ['gitlab'], level: Authorization.ADMIN }
    ]),
    validate(schema.loginValidation)]
  )
  @responses(schema.loginResponses)
  static async loginClient(ctx) {
    const loginService = new LoginService()
    const body = ctx.validatedBody
    try {
      const theUserData = await loginService.loginClient(body)
      return ctx.res.ok(theUserData, 'success')
    } catch (err) {
      logger.error({ message: err.message, data: body, err })
      return ctx.res.forbidden(err.name, 'Login fail.', 'Login fail.')
    }
  }

  @request('post', '/login/gitlab')
  @body({
    code: { type: 'string', require: true },
    mode: { type: 'string', description: 'dev' }
  })
  @summary('login')
  @middlewares(
    // validate(schema.loginValidate)
  )
  @tag
  @responses(schema.loginResponses)
  static async loginGitlab(ctx) {
    const loginService = new LoginService()
    const body = ctx.validatedBody
    const code = body.code
    const mode = body.mode
    try {
      const token = await loginService.loginGitlab(code, mode)
      return ctx.res.ok({ jwt: token }, 'success')
    } catch (err) {
      logger.error({ message: err.message, data: body, err })
      return ctx.res.forbidden(err.name, 'Login fail.', { message: err.message })
    }
  }
}
