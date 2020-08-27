import connection from '../connection'

export default class SyncServices {
  constructor() {
    this.db = connection.db
  }

  dataProcess = (data) => {
    delete data._key
    delete data._id
    delete data._rev
    delete data.createTime
    delete data.modifyTime
    delete data.createUser
    delete data.modifyUser

    return data
  }

  /**
     * 依據aql回傳資料
     * @param {*} query aql
     */
  async executeAQL(query) {
    const result = await this.db.executeAQL(query)
    result.map(item => {
      return this.dataProcess(item)
    })
    return result
  }
}
