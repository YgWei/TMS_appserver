import Services from './Services'
// import { WorkCenterNotFoundException } from '../exception/WorkCenter'
import * as aql from '../aqlString/workcenters'

const formatter = {
  all: (data) => {
    return {
      uuid: data._key,
      name: data.name,
      region: data.region
    }
  },
  selectFormat: (data) => {
    return {
      uuid: data._key,
      name: data.name
    }
  }
}

export default class WorkCenterServices extends Services {
  constructor() {
    super('WorkCenter')
  }

  async findWorkCenter(start, limit, query) {
    const res = await this.query(aql.FIND_WORKCENTER(start, limit, query))
    if (query.type === 'select') {
      res.data = res.data.map((item) => {
        return formatter.selectFormat(item)
      })
    }
    if (query.type === 'all') {
      res.data = res.data.map((item) => {
        return formatter.all(item)
      })
    }
    return res
  }

  async getWorkCenter(uuid) {
    const workCenter = await this.get(uuid)
    return formatter.all(workCenter)
  }

  async createWorkCenter(body, useruuid) {
    const findResult = await this.findWorkCenter(0, 1, { name: body.name })
    if (findResult.count > 0) {
      throw new Error()
    }
    const data = await this.create(body, useruuid, { returnNew: true })
    return formatter.all(data.new)
  }

  async updateWorkCenter(uuid, body, useruuid) {
    const data = await this.update(uuid, body, useruuid, { returnNew: true })
    return formatter.all(data.new)
  }

  async findWorkCenterTemplate(data) {
    const query = `
    FOR twc IN TP_WC_rel
    FILTER twc.workCenterKey == '${data.workCenterUuid}'
    AND twc.invalid == false
    let template = Document("Template",twc.templateKey)
    let production = Document("Production",template.productionKey)
    let company = Document("Company",production.companyKey)
    SORT twc.createTime DESC
    LIMIT ${data.start} ,${data.limit}
    RETURN {template,production,company}`
    const workCentes = await this.query(query)

    return workCentes
  }

  async findWorkCenterUpdateRecord(data) {
    const query = `
    FOR updateRecord IN UpdateRecord
      FOR tpwc IN TP_WC_rel
        FILTER updateRecord.TP_WC_relKey == tpwc._key AND tpwc.workCenterKey == '${data.workcenterUuid}' AND tpwc.invalid == false
    let deployment = Document("Deployment",updateRecord.deploymentKey)
    let template = Document("Template",deployment.templateKey)
    LIMIT ${data.start},${data.limit}
    RETURN {template, updateRecord, deployment}`
    const results = await this.query(query)
    return results
  }
}
