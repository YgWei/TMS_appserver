import Services from './Services'
import { secret } from '../config/token'
import jwt from 'jsonwebtoken'
import Gitlab from '../util/gitlab'
import Authorization from '../util/Authorization'

export default class LoginService extends Services {
  async login(data) {
    const authorization = new Authorization()
    await authorization.adminLogin()
    const third = await authorization.thirdLogin(data.account, data.password)
    const payload = third
    const result = await this.getUserTmsData(payload.uuid)
    for (const key of Object.keys(result)) {
      payload[key] = result[key]
    }
    const token = jwt.sign(payload, secret, { expiresIn: '30 days' })
    return token
  }

  async loginClient(data) {
    const authorization = new Authorization()
    await authorization.adminLogin()
    const third = await authorization.thirdLogin(data.account, data.password)
    const payload = third
    const result = await this.getUserTmsData(payload.uuid)
    for (const key of Object.keys(result)) {
      payload[key] = result[key]
    }
    return payload
  }

  async loginGitlab(code, mode) {
    const gitlab = new Gitlab()
    const authorization = new Authorization()
    const accessToken = await gitlab.getAccessToken(code, mode)
    const gitlabUser = await gitlab.getUser(accessToken)
    await authorization.adminLogin()
    const login = await authorization.gitlabLogin(gitlabUser)
    const payload = {
      ...login,
      gitlab: accessToken
    }
    const token = jwt.sign(payload, secret, { expiresIn: '30 days' })
    return token
  }

  async getUserTmsData(uuid) {
    const query = `FOR user IN User
                  FILTER user.uuid == '${uuid}'
                  RETURN user`
    const results = await super.query(query)
    if (results.count === 1) {
      const result = results.data[0]
      delete result._key
      delete result._id
      delete result._rev
      delete result.uuid
      return result
    }
    return {}
  }
}
