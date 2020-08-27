import Services from './Services'
import WorkCenterServices from './WorkCenter'
import TemplateServices from './Template'
import { DataNotUniqueException, DataNotFoundException } from '../exception'
import * as aql from '../aqlString/tpwcrel'

const listFormat = (data) => {
  delete data.uuid
  delete data.templateUuid

  return data
}

export default class TpWcRelServices extends Services {
  constructor() {
    super('TP_WC_rel')
  }

  async createWorkCenter(uuid, useruuid) {
    const workCenterServices = new WorkCenterServices()
    const templateServices = new TemplateServices()
    const workCenter = await workCenterServices.getWorkCenter(uuid.workcenter)
    const template = await templateServices.getTemplate(uuid.template)
    await this.uniqueWorkcenter(uuid)
    const data = {
      templateKey: uuid.template,
      workCenterKey: uuid.workcenter
    }
    await super.create(data, useruuid)
    const res = {
      templateUuid: template.uuid,
      template: template.name,
      workCenterUuid: workCenter.uuid,
      workCenter: workCenter.name,
      companyUuid: template.company.uuid,
      company: template.company.name,
      productionUuid: template.production.uuid,
      production: template.production.name
    }
    return res
  }

  async getWorkCenterByTemplateUuid(uuid) {
    const res = await this.query(aql.GET_WORKCENTER_BY_TEMPLATEKEY(uuid))
    res.data = res.data.map((item) => {
      return listFormat(item)
    })
    return res.data
  }

  async updateWorkCenter(templateUuid, workCenters) {
    const workCenterServices = new WorkCenterServices()

    const old = await this.db.findByCondition(this.collection, { templateUuid: templateUuid, invalid: null })
    if (old.count > workCenters.length) {
      for (let j = old.count - 1; j >= workCenters.length; j--) {
        await super.invalid(old.data[j].uuid)
      }
    }
    for (let i = 0; i < workCenters.length; i++) {
      const workcenter = await workCenterServices.getWorkCenter(workCenters[i])
      const TpWcRelBody = {
        templateUuid: templateUuid,
        workCenterUuid: workcenter[0].uuid
      }
      if (old.count >= i + 1) {
        await this.db.updateDocument(this.collection, old.data[i], TpWcRelBody)
      } else {
        await super.create(TpWcRelBody)
      }
    }
  }

  async getTpwcrelKey(templateKey, workCenterKey) {
    const result = await this.query(aql.GET_TP_WC_REL_KEY(templateKey, workCenterKey))

    return result
  }

  async uniqueWorkcenter(uuid) {
    const res = await this.collection.byExample({ templateUuid: uuid.template, workCenterUuid: uuid.workcenter, invalid: false })
    if (res.count > 0) {
      throw new DataNotUniqueException(`${this.collection} data not unique.`)
    }
  }

  async deleteWorkCenterTemplate(uuid, useruuid) {
    const tcWc = await this.getWorkcenterByUuids(uuid)

    const res = await super.invalid(tcWc._result[0]._key, useruuid)
    return res
  }

  async getWorkcenterByUuids(uuid) {
    const res = await this.collection.byExample({ templateKey: uuid.template, workCenterKey: uuid.workcenter, invalid: false })
    if (res.count === 0) {
      throw new DataNotFoundException(`${this.collection} data not found.`)
    }
    return res
  }
}
