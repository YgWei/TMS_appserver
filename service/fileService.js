import fs from 'fs-extra'
import request from 'request-promise'
import errors from 'request-promise/errors'
import { FILE_ARRAY_EMPTY, MD5_CHECK_ERROR, DELETE_ERROR } from '../exception/FileService'
import logger from '../logger'
import md5 from 'md5-promised'
import config from '../config'
import _ from 'lodash'

const RETRY_TIMES = config.cloudStorage.retryTimes
const RETRY_DELAY = config.cloudStorage.retryDelay
const mogodbHost = `${config.cloudStorage.protocol}://${config.cloudStorage.host}:${config.cloudStorage.port}`
// const expireHours = config.cloudStorage.fileExpireHR

export default class FileService {
  async uploadFiles(filenames = [], expireHours) {
    const res = []
    const collection = config.cloudStorage.collection
    if (filenames.length === 0) {
      throw FILE_ARRAY_EMPTY
    }

    const url = `${this.getUploadApi(collection)}`
    const paths = filenames.map((item) => {
      const stream = fs.createReadStream(`${item}`)
      return stream
    })

    const options = {
      method: 'POST',
      uri: url,
      formData: {
        file: paths
      }
    }

    let idArray = []
    await this.requestRetry(options, RETRY_TIMES, RETRY_DELAY, async (err, data) => {
      const fileData = {}
      if (err) {
        logger.error('[ File Service ] : Upload fail ', err)
        throw err
      } else {
        const parse = JSON.parse(data)
        idArray = parse.map((item) => {
          fileData.uuid = item._id
          return item._id
        })
        const md5Array = parse.map((item) => {
          fileData.md5 = item.md5
          return item.md5
        })

        const checkMD5 = await this.checkMD5s(filenames, md5Array)
        if (!checkMD5) {
          logger.error('[ File Service ] : md5 check error')

          for (const id of idArray) {
            await this.deleteFile(collection, id)
          }

          throw MD5_CHECK_ERROR
        }
        res.push(fileData)
      }
    })

    if (expireHours) {
      const expireUrl = `${this.setExpireApi(collection)}`

      const expireOptions = {
        method: 'POST',
        uri: expireUrl,
        body: {
          filesID: idArray,
          expireAfterHR: expireHours
        },
        json: true
      }
      try {
        await this.requestRetry(expireOptions, RETRY_TIMES, RETRY_DELAY, async (err, data) => {
          if (err) {
            logger.error('[ File Service ] : Set File expire fail ', err)
            throw err
          }
        })
        logger.info('[ File Service ] : Set File expire success')
      } catch (err) {
        logger.error('[ File Service ] : Set File expire fail', err)
      }
    }

    return res
  }

  async checkMD5(folder, filenames, md5code) {
    const hash = await md5(`${config.root}/${folder}/${filenames}`)
    return hash === md5code
  }

  async checkMD5s(filenames = [], md5code = []) {
    const md5Array = await Promise.all(filenames.map(async (filename) => {
      const hash = await md5(`${config.root}/${filename}`)
      return hash
    }))
    const check = _.isEqual(md5Array.sort(), md5code.sort())
    return check
  }

  getUploadApi(collection) {
    const mogodbUploadUrl = `${mogodbHost}/api/${collection}/upload`
    return mogodbUploadUrl
  }

  getMD5Api(collection, id) {
    const mogodbMD5Url = `${mogodbHost}/api/${collection}/md5/${id}`
    return mogodbMD5Url
  }

  setExpireApi(collection) {
    const mogodbExpireUrl = `${mogodbHost}/api/${collection}/fileExpire`
    return mogodbExpireUrl
  }

  async requestRetry(options, retryTimes, retryDelay, callback) {
    var cntr = 0

    async function run() {
      const result = await request(options, async function () {
        ++cntr
      }).then(async (res) => {
        await callback(null, res)
        return res
      }).catch(DELETE_ERROR, (err) => {
        throw err
      }).catch(errors.StatusCodeError, async (err) => {
        if (cntr >= retryTimes) {
          await callback(err)
        } else {
          logger.error('[ File Service ] : Http request error, ', err)
          logger.info('[ File Service ] : Request retry')
          await delay(retryDelay)
          await run()
        }
      }).catch(errors.RequestError, async (err) => {
        if (cntr >= retryTimes) {
          await callback(err)
        } else {
          logger.error('[ File Service ] : Http request error, ', err)
          logger.info('[ File Service ] : Request retry')
          await delay(retryDelay)
          await run()
        }
      })
      return result
    }
    const data = await run()
    return data
  }
}

function delay(ms) {
  let ctr
  let rej
  const p = new Promise(function (resolve, reject) {
    ctr = setTimeout(resolve, ms)
    rej = reject
  })
  p.cancel = function () { clearTimeout(ctr); rej(Error('Cancelled')) }
  return p
}
