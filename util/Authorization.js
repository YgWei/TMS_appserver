import config from '../config'
import request from 'request-promise'
// import logger from '../logger'
import { DataNotFoundException } from '../exception'
// import jwt from 'jsonwebtoken'
// import { secret } from '../config/token'

const authorizationServer = config.authorizationServer.url
export default class Authorization {
  async adminLogin() {
    const account = config.authorizationServer.account
    const password = config.authorizationServer.password
    this.admin = await this.login(account, password)
  }

  async getUser(uuid) {
    await this.adminLogin()
    const getUser = {
      method: 'GET',
      url: `${authorizationServer}/api/users/${uuid}`,
      headers: {
        Authorization: `Bearer ${this.admin}`
      },
      json: true
    }

    try {
      const user = await request(getUser)
      return user.data
    } catch (err) {
      if (err.statusCode === 404) {
        throw new DataNotFoundException(err.message)
      }
      throw Error(err)
    }
  }

  async findUser(option = {}) {
    const userList = {
      method: 'GET',
      url: `${authorizationServer}/api/users`,
      headers: {
        Authorization: `Bearer ${this.admin}`
      },
      qs: {
        start: option.start | 0,
        limit: option.limit | 10,
        type: option.type
      },
      json: true
    }

    try {
      const userListRes = await request(userList)
      return userListRes.data
    } catch (err) {
      throw Error(err)
    }
  }

  async login(account, password) {
    const login = {
      method: 'POST',
      url: `${authorizationServer}/api/login/system`,
      body: {
        account: account,
        password: password
      },
      json: true
    }
    let res
    try {
      res = await request(login)
      return res.data.jwt
    } catch (err) {
      throw Error(err)
    }
  }

  async thirdLogin(account, password) {
    const login = {
      method: 'POST',
      url: `${authorizationServer}/api/login/third`,
      headers: {
        Authorization: `Bearer ${this.admin}`
      },
      body: {
        account: account,
        password: password
      },
      json: true
    }
    let res
    try {
      res = await request(login)
      return res.data
    } catch (err) {
      throw Error(err)
    }
  }

  async gitlabLogin(gitlabUser) {
    const login = {
      method: 'POST',
      url: `${authorizationServer}/api/login/gitlab`,
      headers: {
        Authorization: `Bearer ${this.admin}`
      },
      body: {
        id: `${gitlabUser.id}`,
        name: gitlabUser.name,
        username: gitlabUser.username,
        email: gitlabUser.email
      },
      json: true
    }
    let res
    try {
      res = await request(login)
      return res.data
    } catch (err) {
      throw Error(err)
    }
  }

  async getUserInfo(jwt) {
    const userInfo = {
      method: 'GET',
      url: `${authorizationServer}/api/users/info`,
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      json: true
    }

    let userInfoRes
    try {
      userInfoRes = await request(userInfo)
    } catch (err) {
      throw Error(err)
    }
    return userInfoRes
  }
}
