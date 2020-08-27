import request from 'request-promise'
import config from '../config'
import logger from '../logger'

const preprocessUrl = `${config.preprocess.protocol}://${config.preprocess.host}:${config.preprocess.port}`
const traceUrl = `${config.trace.protocol}://${config.trace.host}:${config.trace.port}`
export default class Preprocess {
  async preprocess(company, production, version, fileuuid) {
    const produce = {
      method: 'POST',
      url: `${preprocessUrl}/api/tms/produce`,
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: {
        company: company,
        production: production,
        version: version,
        fileuuid: fileuuid,
        outFormat: 'pdf'
      },
      json: true
    }
    console.log(produce.url)
    try {
      const res = await request(produce)
      logger.debug('preprocess', res.data)
      return res.data
    } catch (err) {
      throw Error(err)
    }
  }

  async trace(tmsTraceID) {
    const produce = {
      method: 'GET',
      url: `${traceUrl}/api/v1/status/${tmsTraceID}`,
      json: true
    }
    console.log(produce)
    try {
      const res = await request(produce)
      logger.debug('trace', res)
      return res
    } catch (err) {
      throw Error(err)
    }
  }
}
