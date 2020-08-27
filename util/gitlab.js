import request from 'request-promise'
import config from '../config'
import { GitlabLoginError } from '../exception/Login'
import { GITLAB_ERROR } from '../exception/Gitlab'
import logger from '../logger'

const url = config.gitlab.url
const clientId = config.gitlab.clientId
const clientSecret = config.gitlab.clientSecret
const redirectUri = config.gitlab.redirectUri

export default class Gitlab {
  async getAccessToken(code, mode) {
    const uri = mode === 'dev' ? 'http://localhost:8080/login' : redirectUri
    const options = {
      method: 'POST',
      url: `${url}/oauth/token`,
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: uri
      },
      json: true // Automatically stringifies the body to JSON
    }
    try {
      const res = await request(options)
      return res
    } catch (err) {
      logger.error(err)
      throw new GitlabLoginError(err.message)
    }
  }

  async refreshToken(refreshToken) {
    const options = {
      method: 'POST',
      url: `${url}/oauth/token`,
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      json: true // Automatically stringifies the body to JSON
    }
    try {
      const res = await request(options)
      return res
    } catch (err) {
      logger.error(err)
      throw new GitlabLoginError(err.message)
    }
  }

  async getUser(accessToken) {
    const options = {
      method: 'GET',
      url: `${url}/api/v4/user?access_token=${accessToken.access_token}`,
      header: {

      },
      json: true // Automatically stringifies the body to JSON
    }
    let res
    try {
      res = await request(options)
      return res
    } catch (err) {
      logger.error(err)
      throw new GitlabLoginError(err.message)
    }
  }

  tagRegularExpression(tag) {
    const regExp = new RegExp('^dev-.*$')
    const res = regExp.test(tag)
    return res
  }

  async getTags(accessToken, projectId, search) {
    const options = {
      method: 'GET',
      url: `${url}/api/v4/projects/${projectId}/repository/tags`,
      qs: {
        visibility: 'private',
        access_token: `${accessToken}`,
        search: search
      },
      json: true // Automatically stringifies the body to JSON
    }
    let res
    try {
      res = await request(options)
      return res
    } catch (err) {
      logger.error(err)
      throw new GITLAB_ERROR(err.message)
    }
  }

  async getProjects(token) {
    const options = {
      method: 'GET',
      url: `${url}/api/v4/projects`,
      headers:
      {
        'Content-Type': 'application/json'
      },
      qs: {
        visibility: 'private',
        access_token: `${token}`,
        search: 'TMS'
      },
      json: true // Automatically stringifies the body to JSON
    }
    try {
      const projects = await request(options)
      const res = []
      // projects.forEach(element => {
      //   res.push({
      //     id: element.id,
      //     name: element.name,
      //     url: element.web_url
      //   })
      // })
      for (const proj of projects) {
        if (proj.namespace.name.match('template')) {
          res.push({
            id: proj.id,
            name: proj.name,
            url: proj.web_url
          })
        }
      }
      return res
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  async getProjectById(token, projectId) {
    const options = {
      method: 'GET',
      url: `${url}/api/v4/projects/${projectId}`,
      headers:
      {
        'Content-Type': 'application/json'
      },
      qs: {
        visibility: 'private',
        access_token: `${token}`
      },
      json: true // Automatically stringifies the body to JSON
    }
    try {
      const project = await request(options)
      return project
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  async getBranches(token, projectId, search) {
    const options = {
      method: 'GET',
      url: `${url}/api/v4/projects/${projectId}/repository/branches`,
      headers:
      {
        'Content-Type': 'application/json'
      },
      qs: {
        visibility: 'private',
        access_token: `${token}`,
        search: search
      },
      json: true // Automatically stringifies the body to JSON
    }
    try {
      const branches = await request(options)
      const res = []
      branches.forEach(element => {
        res.push({
          commitId: element.commit.id,
          name: element.name
        })
      })
      return res
    } catch (err) {
      throw new Error(err)
    }
  }

  async createTag(token, projectId, tag, ref) {
    const options = {
      method: 'POST',
      url: `${url}/api/v4/projects/${projectId}/repository/tags?tag_name=${tag}&ref=${ref}`,
      headers:
      {
        'Content-Type': 'application/json'
      },
      qs: {
        visibility: 'private',
        access_token: `${token}`
      },
      json: true // Automatically stringifies the body to JSON
    }
    try {
      const tag = await request(options)
      return tag
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
