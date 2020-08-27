import Services from './Services'
import ProductionServices from './Production'
import CompanyServices from './Company'
import fs from 'fs-extra'
import logger from '../logger'
import FileService from '../service/fileService'
import * as aql from '../aqlString/data'
import UserServices from './User'

const formatter = {
  put: (data) => {
    return {
      uuid: data.data._key,
      name: data.data.name,
      company: data.company.name,
      production: data.production.name,
      cloudStorageUuid: data.data.cloudStorageUuid,
      md5: data.data.md5,
      description: data.data.description,
      invalid: data.data.invalid,
      createTime: data.data.createTime,
      createUser: data.user.name
    }
  },
  all: (data) => {
    return {
      uuid: data.data._key,
      name: data.data.name,
      company: {
        uuid: data.company._key,
        name: data.company.name
      },
      production: {
        uuid: data.production._key,
        name: data.production.name
      },
      cloudStorageUuid: data.data.cloudStorageUuid,
      md5: data.data.md5,
      description: data.data.description,
      invalid: data.data.invalid,
      createTime: data.data.createTime,
      createUser: data.data.createUser
    }
  },
  select: (data) => {
    return {
      uuid: data.data._key,
      name: data.data.name
    }
  }
}

export default class DataServices extends Services {
  constructor() {
    super('Data')
  }

  async findData(query) {
    const start = query.start
    const limit = query.limit
    const type = query.type
    const name = query.name
    const productionKey = query.productionUuid

    const res = await this.query(aql.FIND_DATA(name, productionKey, start, limit))

    const userServices = new UserServices()
    if (type === 'select') {
      res.data = res.data.map((item) => {
        return formatter.select(item)
      })
      return res
    }
    if (type === 'all') {
      res.data = res.data.map((item) => {
        return formatter.all(item)
      })
    }
    if (type === 'list') {
      for (const item of res.data) {
        const user = await userServices.getUser(item.data.createUser)
        item.user = user
      }
      res.data = res.data.map((item) => {
        return formatter.put(item)
      })
    }

    return res
  }

  async getData(_key) {
    const companyServices = new CompanyServices()
    const productionServices = new ProductionServices()
    const userServices = new UserServices()
    const data = await this.get(_key)
    const user = await userServices.getUser(data.createUser)
    data.createUser = user.name
    const production = await productionServices.get(data.productionKey)
    const company = await companyServices.get(production.companyKey)
    const res = formatter.all({ data, production, company })
    return res
  }

  async createData(body, file, useruuid) {
    const productionServices = new ProductionServices()
    const fileService = new FileService()

    const data = {
      productionKey: body.productionUuid,
      name: body.name,
      description: body.description
    }

    // check productionKey exist
    await productionServices.get(data.productionKey)

    const uploadInfo = await fileService.uploadFiles([file.path])
    data.fileName = file.name
    data.cloudStorageUuid = uploadInfo[0].uuid
    data.md5 = uploadInfo[0].md5
    try {
      await fs.unlink(file.path)
    } catch (err) {
      logger.error('Delete unuse file in createData.', err)
      throw err
    }
    const res = await super.create(data, useruuid, { returnNew: true })
    return res.new
  }

  async updateData(uuid, body, useruuid) {
    const companyServices = new CompanyServices()
    const productionServices = new ProductionServices()
    const userServices = new UserServices()
    await productionServices.get(body.productionUuid)
    const data = {
      productionKey: body.productionUuid,
      name: body.name,
      description: body.description
    }

    const result = await this.update(uuid, data, useruuid)

    const getData = await this.get(result._key)
    const production = await productionServices.get(data.productionKey)
    const company = await companyServices.get(production.companyKey)
    const user = await userServices.getUser(getData.createUser)
    return formatter.put({ data: getData, production, company, user })
  }
}
