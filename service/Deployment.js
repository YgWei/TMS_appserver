import Services from './Services'
import Review from './Review'
import CompanyServices from './Company'
import TemplateServices from './Template'
import DataServices from './Data'
import GitlabServices from '../util/gitlab'
import ProductionServices from './Production'
import { TAG_ERROR, TAG_NOT_UNIQUE, BRANCH_NOT_FOUND } from '../exception/Gitlab'
import { DEPLOYMENT_STATE_ERROR } from '../exception/Deployment'
import { DataNotFoundException } from '../exception'
import * as aql from '../aqlString/deployment'
import SsmoService from '../util/ssmo'
import UeserServcies from './User'

const formatter = {
  all: (data) => {
    return {
      uuid: data.deployment._key,
      name: data.deployment.tag,
      company: {
        uuid: data.company._key,
        name: data.company.name
      },
      production: {
        uuid: data.production._key,
        name: data.production.name
      },
      template: {
        uuid: data.template._key,
        name: data.template.name,
        tag: data.deployment.tag
      },
      data: {
        uuid: data.data._key,
        name: data.data.name
      },
      state: data.deployment.status[data.deployment.status.length - 1],
      note: data.deployment.note,
      createTime: data.deployment.createTime
    }
  },
  forGet: (data) => {
    return {
      uuid: data.deployment._key,
      name: data.deployment.tag,
      company: {
        uuid: data.company._key,
        name: data.company.name
      },
      production: {
        uuid: data.production._key,
        name: data.production.name
      },
      template: {
        uuid: data.template._key,
        name: data.template.name,
        repository: data.template.repositoryName,
        tag: data.deployment.tag,
        branch: data.deployment.branch,
        commit: data.deployment.commit
      },
      data: {
        uuid: data.data._key,
        name: data.data.name,
        cloudStorageUuid: data.data.cloudStorageUuid
      },
      state: data.deployment.status[data.deployment.status.length - 1],
      note: data.deployment.note,
      reviewKey: data.deployment.reviewKey,
      createTime: data.deployment.createTime
    }
  },
  list: (data) => {
    return {
      uuid: data.deployment._key,
      template: data.template.name,
      company: data.company.name,
      production: data.production.name,
      data: data.data.name,
      createTime: data.deployment.createTime,
      state: data.deployment.status[data.deployment.status.length - 1],
      tag: data.deployment.tag
    }
  }
}

export default class DeploymentServices extends Services {
  constructor() {
    super('Deployment')
  }

  async findDeployment(query) {
    const templateKey = query.templateUuid
    const start = query.start
    const limit = query.limit
    const type = query.type
    const status = query.status
    const res = await this.query(aql.FIND_DEPLOYMENT(templateKey, status, start, limit))

    if (type === 'list') {
      res.data = res.data.map((item) => {
        return formatter.list(item)
      })
    }

    if (type === 'all') {
      res.data = res.data.map((item) => {
        return formatter.all(item)
      })
    }
    return res
  }

  async getDeployment(uuid) {
    const reviewService = new Review()
    const dataServices = new DataServices()
    const companyServices = new CompanyServices()
    const templateServices = new TemplateServices()
    const productionServices = new ProductionServices()

    const deployment = await this.get(uuid)
    const template = await templateServices.get(deployment.templateKey)
    const data = await dataServices.get(deployment.dataKey)
    const production = await productionServices.get(template.productionKey)
    const company = await companyServices.get(production.companyKey)

    const deploymentData = formatter.forGet({ deployment, template, data, production, company })

    let review = {}
    const message = undefined
    if (deployment.reviewKey) {
      review = await reviewService.getReview(deployment.reviewKey)
    }

    return { deployment: deploymentData, review, message }
  }

  async createDeployment(accessToken, body, user) {
    const dataServices = new DataServices()
    const companyServices = new CompanyServices()
    const templateServices = new TemplateServices()
    const gitlabServices = new GitlabServices()
    const productionServices = new ProductionServices()

    await companyServices.getCompany(body.companyUuid)
    await productionServices.getProduction(body.productionUuid)
    await dataServices.getData(body.dataUuid)
    const template = await templateServices.get(body.templateUuid)
    const projectId = template.projectId
    if (gitlabServices.tagRegularExpression(body.tag) === false) {
      throw new TAG_ERROR()
    }
    const branch = await gitlabServices.getBranches(accessToken, projectId, body.branch)
    if (branch.length === 0) {
      throw new BRANCH_NOT_FOUND()
    }
    body.commit = branch[0].commitId
    const tag = await gitlabServices.getTags(accessToken, projectId, body.tag)
    if (tag.length > 0) {
      throw new TAG_NOT_UNIQUE()
    }

    const deploymentBody = {
      templateKey: body.templateUuid,
      tag: body.tag,
      branch: body.branch,
      commit: body.commit,
      dataKey: body.dataUuid,
      traceUuid: '',
      renderResult: '',
      reviewKey: '',
      status: ['init'],
      note: body.note,
      invalid: false
    }

    const res = await super.create(deploymentBody, user.uuid)
    return res
  }

  async updateDeployment(uuid, body, useruuid) {
    const data = {
      note: body.note
    }
    const res = await this.update(uuid, data, useruuid, { returnNew: true })
    return res.new
  }

  async deployInitiate(uuid, user) {
    const gitlab = new GitlabServices()
    const templateServices = new TemplateServices()
    const deployment = await this.get(uuid)
    if (deployment.status[deployment.status.length - 1] === 'init') {
      const data = {
        status: ['init', 'deploy']
      }
      const deployment = await this.get(uuid)
      const template = await templateServices.get(deployment.templateKey)
      await gitlab.createTag(user.gitlab.access_token, template.projectId, deployment.tag, deployment.branch)
      await super.update(uuid, data, user.uuid)
      return deployment
    } else {
      throw new DEPLOYMENT_STATE_ERROR('DEPLOYMENT_STATE_ERROR', {
        _key: uuid,
        currentState: deployment.status[deployment.status.length - 1]
      })
    }
  }

  async deploySuccess(projectId, tag) {
    const ssmoService = new SsmoService()
    const res = await this.query(aql.GET_DEPLOYMENT_BY_PROJECTID_TAG(projectId, tag))
    if (res.count === 0) {
      throw new DataNotFoundException(this.col, { projectId, tag })
    }
    const deployment = res.data[0]
    if (deployment.status[deployment.status.length - 1] === 'deploy') {
      let data = {
        status: ['init', 'deploy', 'deploy_success']
      }
      await super.update(deployment._key, data, 'gitlab-ci')
      let preData = await this.query(aql.GET_DEPLOYMENT_FOR_PREPROCESS(deployment._key))
      preData = preData.data[0]
      const preprocess = await ssmoService.preprocess(preData.company._key, preData.production._key, preData.deployment.tag, preData.data.cloudStorageUuid)
      data = {
        traceUuid: preprocess.tmsTraceID
      }
      await super.update(deployment._key, data, 'gitlab-ci')
      return 'success'
    } else {
      throw new DEPLOYMENT_STATE_ERROR('DEPLOYMENT_STATE_ERROR', {
        _key: deployment._key,
        currentState: deployment.status[deployment.status.length - 1]
      })
    }
  }

  async deployRenderResult(deploymentKey, useruuid) {
    const ssmoService = new SsmoService()
    const deployment = await this.get(deploymentKey)
    if (deployment.renderResult) {
      return {
        success: true,
        complete: true,
        fileID: deployment.renderResult
      }
    } else {
      const traceUuid = deployment.traceUuid
      const trace = await ssmoService.trace(traceUuid)
      if (trace.complete) {
        const data = {
          renderResult: trace.fileID
        }
        await super.update(deployment._key, data, useruuid)
      }
      return trace
    }
  }

  async findTag(accessToken, query) {
    const templateServices = new TemplateServices()
    const gitlabServices = new GitlabServices()
    const template = await templateServices.get(query.templateUuid)
    const projectId = template.projectId
    const res = await this.query(aql.FIND_DEPLOYMENT_BY_TAG(query.templateUuid, query.tag))
    if (res.count > 0) {
      return res.data
    }
    const tag = await gitlabServices.getTags(accessToken, projectId, query.tag)
    const filter = tag.filter(item => {
      return item.name === query.tag
    })
    return filter
  }

  async getRenderResult(uuid, query) {
    const reviewRecord = await this.query(aql.GET_DEPLOYMENT_REVIEW_RESULT(uuid, query.group, query.start, query.limit))
    const userServcies = new UeserServcies()
    const data = []
    for (const item of reviewRecord.data) {
      const user = await userServcies.getUser(item.useruuid)
      data.push({
        uuid: item._key,
        user: {
          uuid: user.uuid,
          name: user.name
        },
        time: item.modifyTime,
        result: item.result,
        message: item.message
      })
    }
    reviewRecord.data = data
    return reviewRecord
  }
}
