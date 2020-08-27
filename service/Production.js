import Services from './Services'
import * as aql from '../aqlString/production'

const formatter = {
  select: (data) => {
    return {
      uuid: data._key,
      name: data.name
    }
  },
  all: (data) => {
    return {
      uuid: data._key,
      name: data.name,
      description: data.description,
      companyKey: data.companyKey
    }
  }
}
export default class ProductionServices extends Services {
  constructor() {
    super('Production')
  }

  async findProduction(companyKey, query) {
    const start = query.start
    const limit = query.limit
    const name = query.name
    const type = query.type

    let res
    if (name) {
      res = await this.query(aql.GET_PRODUCTION_BY_NAME(companyKey, name, start, limit))
    } else {
      res = await this.query(aql.GET_PRODUCTION(companyKey, start, limit))
    }

    if (type === 'select') {
      res.data = res.data.map((item) => {
        return formatter.select(item)
      })
    }

    if (type === 'all') {
      res.data = res.data.map((item) => {
        return formatter.all(item)
      })
    }
    return res
  }

  async getProduction(productionUuid) {
    const production = await this.get(productionUuid)
    return formatter.all(production)
  }

  async createProduction(companyUuid, body, useruuid) {
    const data = {
      name: body.name,
      companyKey: companyUuid,
      description: body.description
    }
    const res = await this.create(data, useruuid)
    return formatter.all(res.new)
  }

  async updateProduction(productionUuid, body, useruuid) {
    const data = {
      name: body.name,
      description: body.description
    }
    const res = await this.update(productionUuid, data, useruuid)
    return formatter.all(res.new)
  }
}
