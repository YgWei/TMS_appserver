import config from '../config'
import logger from '../logger'
import _ from 'lodash'

export default class arangodbservices {
  /*
    若沒有特殊指定則使用預定 root 登入 本地arangodb
    @params connConfig : 連線參數
         example: {host:'127.0.0.1',
                   port:'8529',
                   username : 'root',
                   userpassword:'root'}
  */
  async loginCheck() {
    try {
      await this.db.login(config.arangodb.username, config.arangodb.userpassword)
      return true
    } catch (err) {
      logger.debug(err)
      return false
    }
  }

  async checkConnection() {
    const version = await this.db.version()
    return version
  }

  /*
   確認資料庫狀態<更改.
   @params databaseName : databaseName
   @return database information
  */
  async checkDatabase(databaseName) {
    try {
      const databases = await this.db.listDatabases()
      const isFind = _.find(databases, function (item) {
        return item.toUpperCase() === databaseName.toUpperCase()
      })
      if (!isFind) {
        await this.db.createDatabase(databaseName, [{ username: 'root' }])
      }
    } catch (err) {
      logger.error(err)
      return databaseName
    }
    await this.db.useDatabase(databaseName)
    return this.db.get()
  }

  /*
   建立文件(create)
   @params collectionName : document collection name
   @params data : document content format is json
   @return insert document content
  */
  async saveDocument(collectionName, data) {
    const isExist = await this.db.collection(collectionName).exists()
    if (!isExist) {
      await this.db.collection(collectionName).create()
    }
    const collection = await this.db.collection(collectionName)
    const result = await collection.save(data, { returnNew: true })
    return result
  }

  /*
   @params collectionName : document collection name
   @params documentHandler : document _id or _key value
   @params data : update  content format is json
   @return document status
  */
  async updateDocument(collectionName, documentHandler, data) {
    const opts = {
      returnNew: true,
      documentHandler: documentHandler
    }
    try {
      const result = await this.db
        .collection(collectionName)
        .update(opts.documentHandler, data, opts)
      return result
    } catch (err) {
      if (err.isArangoError) {
        logger.error(err)
        throw err
      }
    }
  }

  /**
   * 依照給定的documents更新collection documents
   * @param collectionName: String
   *          collection name
   * @param documents: Array(Object)
   *          要更新的文件，每個Object必須具有_id或_key
   * @returns {Promise<any>} Array(Object)
   *          返回更新後的 document array ,使用Object.new取得更新的Object
   */
  async updateDocuments(collectionName, documents) {
    const opts = {
      returnNew: true
    }
    try {
      const result = await this.db
        .collection(collectionName)
        .bulkUpdate(documents, opts)
      return result
    } catch (err) {
      if (err.isArangoError) {
        logger.error(err)
        throw err
      }
    }
  }

  /**
   * find the documentCollection all documents
   * @param collectionName {string} : collection name
   * @param options {object}: 擴充功能 =>{start:起始位址,limit:幾筆}
   * @returns {Promise<*|Array>} document array
   */
  async findAll(collectionName, options = {}) {
    const params = { '@collection': collectionName }
    let query = `FOR item IN @@collection `

    if (options && options.start && options.limit) {
      query += `LIMIT @start ,@end `

      params.start = Number(options.start) || 0
      params.end = Number(options.limit) || 20
    }
    query += `RETURN item`
    try {
      const result = await this.db.query(query, params)
      return result._result
    } catch (err) {
      if (err.isArangoError) {
        logger.error(err)
        throw err
      }
    }
  }

  /*
    EdgeCollection save document
    @params collectionName : edgecollection name
    @params from : object documents object
    @params to : object documents object
    @params description : edgecollection content
    @params opts : options
    @return edgecollection document
  */
  async edgeCollectionSave(collectionName, from, to, description, opts) {
    const edgeCollection = this.db.edgeCollection(collectionName)
    const isExist = await edgeCollection.exists()
    if (!isExist) {
      await edgeCollection.create()
    }

    const options = Object.assign({ returnNew: true }, opts)
    if (description) {
      const result = await edgeCollection.save(description, from, to, options)
      return result
    }
    const result = await edgeCollection.save({}, from, to, options)
    return result
  }

  /*
   Update EdgeCollection document
   @params collectionName : collection name
   @params documentHandler : object include _id or _key
   @params updateData : want to update data
   @return edgecollection update document
  */
  async updateEdgeCollectionDocument(collectionName,
    documentHandler,
    updateData) {
    try {
      const edgeCollection = this.db.collection(collectionName)
      const result = await edgeCollection.update(documentHandler, updateData)
      return result
    } catch (err) {
      if (err.isArangoError) {
        logger.error(err)
        throw err
      }
    }
  }

  /**
   * 依據條件搜尋
   * @param collectionName {string} : collection name
   * @param condition {Object} :  search condition
   *              format:{field:value,...} <and operations>, {field: {$in:[]}}<in operation>
   * @param options {Object} : 擴充功能 =>{start:起始位址,limit:幾筆},{sort:{field: 1|-1}}(排序)
   * @returns {Promise<void>}
   *              result array
   */
  async findByCondition(collectionName, condition, options) {
    const params = { '@collection': collectionName }
    let andString = ''
    _.forEach(Object.keys(condition), function (key, index) {
      if (index !== 0) andString += 'AND'

      if (key.includes('.')) {
        andString += ` item`
        let keyArr = []
        keyArr = key.split('.')
        _.forEach(keyArr, (value, arrKey) => {
          andString += `[@key${index}_${arrKey}]`
          params[`key${index}_${arrKey}`] = value
        })
      } else {
        andString += ` item[@key${index}] `
        params[`key${index}`] = key
      }

      if (condition[key] && condition[key]['$in']) {
        andString += ` in `
        params[`value${index}`] = condition[key].$in
      } else {
        andString += ` == `
        params[`value${index}`] = condition[key]
      }
      andString += ` @value${index} `
    })
    let query = `FOR item IN @@collection ${andString ? 'FILTER' + andString : ''} `
    if (options) {
      if (options.sort) {
        _.forEach(Object.keys(options.sort), function (key, index) {
          if (index === 0) {
            query += `SORT `
          } else {
            query += ', '
          }
          query += `item[@sort${index}] `
          params[`sort${index}`] = key

          if (options.sort[key] === -1) {
            query += 'DESC '
          }
        })
      }
      if (options.start && options.limit) {
        query += `LIMIT @start ,@end `

        params.start = Number(options.start) || 0
        params.end = Number(options.limit) || 20
      }
    }
    query += `RETURN item`

    logger.debug(`Execute query: ${query}, bindValue: ${JSON.stringify(params)}`)

    try {
      const result = await this.db.query(query, params, { count: true, options: { fullCount: true } })
      return { count: result.extra.stats.fullCount, data: result._result }
    } catch (err) {
      if (err.isArangoError) {
        logger.error(err)
        throw err
      }
    }
  }

  /*
   依據條件作OR搜尋。
   @params collectionName : collection name
   @params condition :  search condition
           format:[{field:value},...] <or operations>
   @options : 擴充功能 =>{start:起始位址,limit:幾筆}
   @return result array
  */
  async findByOrCondition(collectionName, condition, options) {
    let orQuery = ''
    if (!options) {
      options = { start: 0, limit: 20 }
    }
    const page = {
      start: Number(options.start) || 0,
      limit: Number(options.limit) || 20
    }
    const params = {
      start: page.start,
      end: page.limit
    }
    _.forEach(condition, function (item, index) {
      if (index === 0) {
        orQuery += ` item[@${item.key + index}] == @${'value' + index}`
        params[item.key + index] = item.key
        params['value' + index] = item.value
      } else {
        orQuery += ` OR item[@${item.key + index}] == @${'value' + index}`
        params[item.key + index] = item.key
        params['value' + index] = item.value
      }
    })
    const query = `FOR item IN ${collectionName} FILTER ${orQuery} LIMIT @start, @end RETURN item`
    const result = await this.db.query(query, params)
    return result._result
  }

  /*
    搜尋最後一個文件特定key，value type is array
    @params collectionName : collection name
    @params condition : search condition
             format:{field : searchField,
                     value : filtervalue} 只接受單一條件
    @options : 擴充功能 =>{start:起始位址,limit:幾筆}
    @return documents array
  */
  async findArrayLast(collectionName, condition, options) {
    if (!options) {
      options = { start: 0, limit: 20 }
    }
    const page = {
      start: Number(options.start) || 0,
      limit: Number(options.limit) || 20
    }
    const postion = -1
    const query = `FOR item IN ${collectionName} FILTER
                  item['${condition.field}'][${postion}] == '${condition.value}'
                  LIMIT ${page.start}, ${page.limit} return item`
    try {
      const result = await this.db.query(query)
      return result._result
    } catch (err) {
      if (err.isArangoError) {
        logger.error(err)
        throw err
      }
    }
  }

  /*
   搜尋edgeCollection reference outbound documents
   @params collectionName : collection name
   @params startVertex : 開始頂點 example:{_id:'some/33456',...}
   @options : 擴充功能 =>{start:起始位址,limit:幾筆}
   @return outbound documents array
  */
  async findEdgeOutbound(collectionName, startVertex, options) {
    if (!options) {
      options = { start: 0, limit: 20 }
    }
    const page = {
      start: Number(options.start) || 0,
      limit: Number(options.limit) || 20
    }
    const data = JSON.stringify(startVertex)
    const query = `FOR v,e,p IN OUTBOUND ${data} ${collectionName} LIMIT ${
      page.start
    } ,${page.limit} return {v,e,p}`
    try {
      const result = await this.db.query(query)
      return result._result
    } catch (err) {
      if (err.isArangoError) {
        logger.error(err)
        throw err
      }
    }
    // const edgeCollection = this.db.edgeCollection(collectionName)
    // const result = await edgeCollection.outEdges(outEdges)
    //  return result;
  }

  /**
   * 依照傳入AQL執行
   * @param query string | AqlQuery | AqlLiteral
   *          AQL查詢字串、AQL query Object or AQL literal
   * @returns {Promise<*|Array>}
   *          AQL response
   */
  async executeAQL(query) {
    try {
      const result = await this.db.query(query, {}, { count: true, options: { fullCount: true } })
      return { count: result.extra.stats.fullCount, data: result._result }
    } catch (err) {
      if (err.isArangoError) {
        logger.error(err)
        throw err
      }
    }
  }

  close() {
    this.db.close()
  }
}
