import Services from './Services'
// import WorkCenterServices from './WorkCenter'
import TemplateServices from './Template'
import TPWCRelService from './TP_WC_rel'
import { DataNotFoundException } from '../exception'
import * as aql from '../aqlString/productOwner'

const formatter = {
  all: (data) => {
    return {
      uuid: data.productOwner._key,
      product: data.production.name,
      name: data.productOwner.name,
      phone: data.productOwner.phone,
      email: data.productOwner.email
    }
  },
  create: (data) => {
    return {
      uuid: data._key,
      tpwcrel: data.tpwcrelKey,
      workCenterUuid: data.workCenterUuid,
      templateUuid: data.templateUuid,
      name: data.name,
      phone: data.phone,
      email: data.email
    }
  },
  update: (data) => {
    return {
      uuid: data._key,
      tpwcrel: data.tpwcrelKey,
      name: data.name,
      phone: data.phone,
      email: data.email
    }
  }
}

export default class ProductOwnerServices extends Services {
  constructor() {
    super('ProductOwner')
  }

  async findProductOwner(start, limit) {
    const res = await this.query(aql.FIND_PRODUCT_OWNER(start, limit))
    res.data = res.data.map((item) => {
      return formatter.all(item)
    })
    return res
  }

  async create(body, useruuid) {
    const tPWCRelService = new TPWCRelService()
    const tpwc = await tPWCRelService.collection.byExample({ workCenterKey: body.workCenterUuid, templateKey: body.templateUuid, invalid: false })
    const data = {
      tpwcrelKey: tpwc._result[0]._key,
      name: body.name,
      email: body.email,
      phone: body.phone
    }

    const res = await super.create(data, useruuid, { returnNew: true })
    return formatter.create({ ...res.new, workCenterUuid: body.workCenterUuid, templateUuid: body.templateUuid })
  }

  async findByWorkCenterUuid(data) {
    const query = `
    FOR po IN ProductOwner
      FOR tpwc IN TP_WC_rel
        FILTER po.invalid == false AND tpwc._key == po.tpwcrelKey AND tpwc.workCenterKey == "${data.workCenterUuid}"
    let template = Document("Template",tpwc.templateKey)
    SORT po.createTime DESC
    LIMIT ${data.start} ,${data.limit}
    RETURN {
      uuid:po._key,
      workCenterUuid:tpwc.workCenterKey,
      templateUuid:tpwc.templateKey,
      name:po.name,
      email:po.email,
      phone:po.phone,
      templateName:template.name,
      template:{
        templateUuid:template._key,
        name:template.name}}`
    const productOwner = await this.query(query)

    return productOwner
  }

  async deleteByWorkCenterUuid(data, useruuid) {
    const res = await super.invalid(data.uuid, useruuid)
    return res
  }

  async updateByByWorkCenterUuid(data, useruuid) {
    const templateServices = new TemplateServices()
    await templateServices.getTemplate(data.templateUuid)
    const uuid = data.uuid
    delete data.uuid
    const res = await super.update(uuid, data, useruuid)
    return formatter.update(res.new)
  }

  async getWorkByByWorkCenterUuid(data) {
    const productOwner = await this.collection.byExample({ uuid: data.uuid, workCenterUuid: data.workCenterUuid, invalid: false })
    if (productOwner.count === 0) {
      throw new DataNotFoundException(`${this.collection} data not found.`)
    }
    return productOwner
  }

  async findProductOwnerByTPWCrel(tpwcrelKey) {
    const res = await this.query(aql.GET_PRODUCT_OWNER_BY_TPWCRELKEY(tpwcrelKey))
    return res
  }
}
