import Services from './Services'
import { CompanyAlreadyException } from '../exception/Company'
import * as aql from '../aqlString/company'

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
      name: data.name
    }
  }
}

export default class CompanyServices extends Services {
  constructor() {
    super('Company')
  }

  async getCompany(_id) {
    const res = await super.get(_id)
    return formatter.all(res)
  }

  async findCompany(query) {
    const type = query.type
    const name = query.name
    const start = query.start
    const limit = query.limit

    let res
    if (name) {
      res = await this.query(aql.GET_COMPANY_BY_NAME(name, start, limit))
    } else {
      res = await this.query(aql.GET_COMPANY(start, limit))
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

  async createCompany(body, user) {
    const count = await this.query(aql.GET_COMPANY_BY_NAME(body.name, 0, 10))
    if (count > 0) {
      throw new CompanyAlreadyException('company already exist')
    }
    const data = {
      name: body.name
    }
    const res = await super.create(data, user.uuid)
    return formatter.all(res.new)
  }

  async updateCompany(_key, data, useruuid) {
    const update = {
      name: data.name
    }
    const res = await this.update(_key, update, useruuid)
    return formatter.all(res.new)
  }
}
