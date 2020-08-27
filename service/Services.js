import connection from '../connection'
import { DataNotFoundException, DataUpdateError, DataSaveError } from '../exception'
import logger from '../logger'
export default class Services {
  constructor(collection) {
    this.db = connection
    this.col = collection
    this.collection = connection.collection(collection)
  }

  async get(_id) {
    try {
      const doc = await this.collection.document(_id)
      return doc
    } catch (err) {
      throw new DataNotFoundException(this.col, _id)
    }
  }

  async query(query, opt) {
    logger.debug(query)
    const result = await this.db.query(query, {}, { count: true, options: { fullCount: true } })
    return { count: result.extra.stats.fullCount, data: result._result, ...opt }
  }

  async create(data, user, opt) {
    if (!user) {
      throw new Error('user can\'t be empty')
    }
    data = {
      ...data,
      createTime: new Date(),
      createUser: user,
      modifyTime: new Date(),
      modifyUser: user,
      invalid: false
    }
    try {
      const res = await this.collection.save(data, { returnNew: true, ...opt })
      return res
    } catch (err) {
      throw new DataSaveError(err.response.body.errorMessage, { data, user })
    }
  }

  async update(_key, data, user, opt) {
    if (!user) {
      throw new Error('user can\'t be empty')
    }
    data = {
      ...data,
      modifyTime: new Date(),
      modifyUser: user
    }
    try {
      const res = await this.collection.update(_key, data, { returnNew: true, ...opt })
      return res
    } catch (err) {
      throw new DataUpdateError(err.response.body.errorMessage, { _key, data, user })
    }
  }

  async invalid(_id, user, opt) {
    const data = {
      invalid: true
    }
    const res = await this.update(_id, data, user, opt)
    return res
  }
}
