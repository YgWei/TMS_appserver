import Services from './Services'
import { DataError } from '../exception'
import CompanyServices from './Company'
import ProductionServices from './Production'
import WorkCenterServices from './WorkCenter'
import TpWcRelServices from './TP_WC_rel'
import GitlabServices from '../util/gitlab'
import * as aql from '../aqlString/Template'
import _ from 'lodash'
import logger from '../logger'
const formatter = {
  list: (data) => {
    return {
      uuid: data.template._key,
      name: data.template.name,
      company: data.company.name,
      production: data.production.name,
      repository: data.template.repositoryName,
      type: data.template.type,
      entryPoint: data.template.entryPoint,
      description: data.template.description,
      workCenters: data.template.workCenters
    }
  },
  all: (data) => {
    return {
      uuid: data.template._key,
      name: data.template.name,
      company: {
        uuid: data.company._key,
        name: data.company.name
      },
      production: {
        uuid: data.production._key,
        name: data.production.name
      },
      repository: {
        id: data.template.projectId,
        name: data.template.repositoryName
      },
      type: data.template.type,
      entryPoint: data.template.entryPoint,
      description: data.template.description,
      invalid: data.template.invalid
    }
  }
}

export default class TemplateServices extends Services {
  constructor() {
    super('Template')
  }

  async findTemplate(query) {
    const type = query.type
    const start = query.start
    const limit = query.limit
    const filter = {
      name: query.name,
      productionKey: query.productionUuid
    }
    const res = await super.query(aql.FIND_TEMPATE(filter, start, limit))
    const templateBody = {
      count: res.count,
      data: res.data.map((item) => {
        try {
          if (type === 'list') {
            return formatter.list(item)
          }
          return formatter.all(item)
        } catch (err) {
          throw new DataError('Template data is not correct.', item)
        }
      })
    }
    return templateBody
  }

  async getTemplate(_key) {
    const companyServices = new CompanyServices()
    const productionServices = new ProductionServices()
    const tpWcRelServices = new TpWcRelServices()
    const workCenterServices = new WorkCenterServices()
    const template = await this.get(_key)
    const production = await productionServices.get(template.productionKey)
    const company = await companyServices.get(production.companyKey)
    const workCenters = await tpWcRelServices.getWorkCenterByTemplateUuid(_key)

    template.workCenters = []
    let wc = null
    for (wc of workCenters) {
      const workCenter = await workCenterServices.get(wc.workCenterKey)
      const body = {
        workCenterUuid: workCenter._key,
        workCenterName: workCenter.name
      }
      template.workCenters.push(body)
    }

    return formatter.list({ template, production, company })
  }

  async createTemplate(accessToken, body, user) {
    const productionServices = new ProductionServices()
    const workCenterServices = new WorkCenterServices()
    const gitlabServices = new GitlabServices()

    // check data is exit
    await productionServices.get(body.productionUuid)
    for (let i = 0; i < body.workCenters.length; i++) {
      await workCenterServices.get(body.workCenters[i])
    }
    const repository = await gitlabServices.getProjectById(accessToken, body.projectId)

    const templateData = {
      name: body.name,
      productionKey: body.productionUuid,
      repositoryName: repository.name,
      projectId: body.projectId,
      type: body.type,
      entryPoint: body.entryPoint,
      description: body.description,
      invalid: false,
      createTime: new Date(),
      createBy: user,
      modifyTime: new Date(),
      modifyUser: user
    }

    const db = this.db
    const template = db.collection('Template')
    const tpwc = db.collection('TP_WC_rel')
    const trx = await db.beginTransaction({
      write: [template, tpwc] // collection instances can be passed directly
    })
    const newTemplate = await trx.run(() => template.save(templateData))

    for (let i = 0; i < body.workCenters.length; i++) {
      const TpWcRelBody = {
        workCenterKey: body.workCenters[i],
        templateKey: newTemplate._key,
        invalid: false,
        createTime: new Date(),
        createBy: user,
        modifyTime: new Date(),
        modifyUser: user
      }
      await trx.run(() => tpwc.save(TpWcRelBody))
    }

    await trx.commit()
    return newTemplate
  }

  async updateTemplate(uuid, body, user) {
    const workCenterServices = new WorkCenterServices()
    await this.get(uuid)
    for (const item of body.workCenters) {
      await workCenterServices.get(item)
    }

    const db = this.db
    const template = db.collection('Template')
    const tpwc = db.collection('TP_WC_rel')
    const trx = await db.beginTransaction({
      read: [tpwc],
      write: [template, tpwc] // collection instances can be passed directly
    })
    const templateData = {
      name: body.name,
      type: body.type,
      entryPoint: body.entryPoint,
      description: body.description,
      modifyTime: new Date(),
      modifyUser: user
    }

    const workcenterArray = []
    for (const item of body.workCenters) {
      workcenterArray.push({
        workCenterKey: item,
        templateKey: uuid,
        invalid: false,
        modifyTime: new Date(),
        modifyUser: user
      })
    }

    const tpwcOld = await trx.run(() => tpwc.byExample({ templateKey: uuid, invalid: false }))
    // 依據workCenterKey以第一個參數為主體,回傳第一個參數中與第二參數不同的值
    const invalidArray = _.differenceBy(tpwcOld._result, workcenterArray, 'workCenterKey') || []
    const insertArray = _.differenceBy(workcenterArray, tpwcOld._result, 'workCenterKey') || []
    logger.debug('tpwcOld._result', { data: tpwcOld._result })
    logger.debug('workcenterArray', { data: workcenterArray })
    logger.debug('invalidArray', { data: invalidArray })
    logger.debug('insertArray', { data: insertArray })

    const save = await trx.run(() => template.update(uuid, templateData))
    logger.debug('save template', { data: save })

    if (invalidArray.length > 0) {
      for (const i in invalidArray) {
        const tpwcRes = await trx.run(() => tpwc.update(invalidArray[i]._key, { invalid: true }))
        logger.debug(`invalidArray[${i}]`, { data: tpwcRes })
      }
    }
    if (insertArray.length > 0) {
      for (const i in insertArray) {
        const tpwcRes = await trx.run(() => tpwc.save(insertArray[i]))
        logger.debug(`insertArray[${i}]`, { data: tpwcRes })
      }
    }
    await trx.commit()
    const res = this.getTemplate(save._key)
    return res
  }

  async findTemplateByWorkcenter(uuid, query) {
    const start = query.start | 0
    const limit = query.limit | 10
    const res = await this.query(aql.GET_WORKCENTER_BY_TEMPATE(uuid, start, limit))

    res.data = res.data.filter((item) => {
      return item.wc !== null
    })
    res.count = 0
    res.data = res.data.map((item) => {
      res.count++
      return {
        uuid: item.wc._key,
        name: item.wc.name
      }
    })
    return res
  }

  async invalid(_id, user) {
    const res = await super.invalid(_id, user)
    return res.new
  }
}
