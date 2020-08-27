import Services from './Services'
import CompanyServices from './Company'
import TemplateServices from './Template'
import ProductionServices from './Production'
import DataServices from './Data'
import { INPUT_DATA_NOT_COMPLETE, STATUS_NOT_CORRECT } from '../exception/Release'
import * as aql from '../aqlString/deployment'

const formatter = {
  find: (data) => {
    return {
      uuid: data.deployment._key,
      name: data.deployment.tag,
      company: data.company.name,
      production: data.production.name,
      template: data.template.name,
      deployment: data.deployment.tag,
      data: data.data.name
    }
  },
  getRelease: (data) => {
    return {
      uuid: data.deployment._key,
      name: data.deployment.tag,
      company: data.company.name,
      production: data.production.name,
      template: data.template.name,
      deployment: data.deployment.tag,
      status: data.deployment.status,
      data: data.data.name
    }
  },
  select: (data) => {
    return {
      uuid: data.deployment._key,
      name: data.deployment.tag
    }
  }
}

export default class ReleaseServices extends Services {
  constructor() {
    super('Deployment')
  }

  async findRelease(templateKey, start, limit) {
    const deployment = await this.query(aql.SELECT_RELEASE_DEPLOYMENT(templateKey, start, limit))
    deployment.data = deployment.data.map((item) => {
      return formatter.select(item)
    })

    return deployment
  }

  async getRelease(_key) {
    const deployment = await this.get(_key)
    const companyServices = new CompanyServices()
    const productionServices = new ProductionServices()
    const templateServices = new TemplateServices()
    const dataServices = new DataServices()
    const template = await templateServices.get(deployment.templateKey)
    const production = await productionServices.get(template.productionKey)
    const company = await companyServices.get(production.companyKey)
    const data = await dataServices.get(deployment.dataKey)

    return formatter.getRelease({ deployment, company, production, template, data })
  }

  async findByTemplareUUID(templateUUID, start, limit) {
    const deployment = await this.query(aql.FIND_RELEASE_DEPLOYMENT({ templateKey: templateUUID }, start, limit))
    deployment.data = deployment.data.map((item) => {
      return {
        deploymentUuid: item.deploymentUuid
      }
    })
    return deployment
  }

  async getReleaseTree(query) {
    const companyServices = new CompanyServices()
    const productionServices = new ProductionServices()
    const templateServices = new TemplateServices()

    let results = []

    switch (query.select) {
      case 'root':
        const company = await companyServices.collection.byExample({ invalid: false })
        const companyData = company._result.map((item) => {
          return {
            uuid: item._key,
            name: item.name,
            companyUuid: item._key,
            type: 'company'
          }
        })
        results = companyData
        break
      case 'company':
        if (!query.companyUuid) {
          throw new INPUT_DATA_NOT_COMPLETE('companyUuid')
        }
        const production = await productionServices.collection.byExample({ companyKey: query.companyUuid, invalid: false })
        const productionData = production._result.map((item) => {
          return {
            uuid: item._key,
            name: item.name,
            companyUuid: item.companyKey,
            productionUuid: item._key,
            type: 'production'
          }
        })
        results = productionData
        break
      case 'production':
        if (!query.productionUuid) {
          throw new INPUT_DATA_NOT_COMPLETE('productionUuid')
        }
        const template = await templateServices.collection.byExample({ productionKey: query.productionUuid, invalid: false })
        const templateData = template._result.map((item) => {
          return {
            uuid: item._key,
            name: item.name,
            companyUuid: query.companyUuid,
            productionUuid: query.productionUuid,
            templateUuid: item._key,
            type: 'template'
          }
        })
        results = templateData
        break
      case 'template':
        if (!query.templateUuid) {
          throw new INPUT_DATA_NOT_COMPLETE('templateUuid')
        }
        let count = await this.collection.count()
        const deployment = await this.query(aql.FIND_RELEASE_DEPLOYMENT(query.templateUuid, 0, count.count))
        const deploymentData = deployment.data.map((item) => {
          return {
            uuid: item.deployment._key,
            name: item.deployment.tag,
            companyUuid: query.companyUuid,
            productionUuid: query.productionUuid,
            templateUuid: query.templateUuid,
            deploymentUuid: item.deployment._key,
            type: 'deployment'
          }
        })
        results = deploymentData
        break
      case 'deployment':
        if (!query.deploymentUuid) {
          throw new INPUT_DATA_NOT_COMPLETE('deploymentUuid')
        }
        count = await this.collection.count()
        const data = await this.query(aql.FIND_RELEASE_DATA(query.deploymentUuid, 0, count.count))
        const dataData = data.data.map((item) => {
          return {
            uuid: item.data._key,
            name: item.data.name,
            companyUuid: query.companyUuid,
            productionUuid: query.productionUuid,
            templateUuid: query.templateUuid,
            deploymentUuid: item.deployment._key,
            dataUuid: item.data._key,
            type: 'data'
          }
        })
        results = dataData
        break
    }

    const releaseTreeBody = {
      results
    }

    return releaseTreeBody
  }

  async createRelease(uuid, useruuid) {
    const old = await this.get(uuid)
    const status = old.status
    if (status[status.length - 1] !== 'review_accept') {
      throw new STATUS_NOT_CORRECT()
    }

    status.push('release')

    const data = {
      status
    }
    const res = await this.update(uuid, data, useruuid)

    return res.new
  }
}
