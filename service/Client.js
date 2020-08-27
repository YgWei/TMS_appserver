import Services from './Services'
import UpdateRecordServices from '../service/UpdateRecord'
import DeploymentServices from '../service/Deployment'
import TemplateServices from '../service/Template'
import DataServices from '../service/Data'
import SsmoService from '../util/ssmo'
import ProductionServices from './Production'
import * as aql from '../aqlString/client'
import { DataNotFoundException } from '../exception'

export default class ClientServices extends Services {
  async findWorkCenterUpdateRecord(workCenterKey, query) {
    const results = await super.query(aql.FIND_WORKCENTER_UPDATERECORD(workCenterKey, query.start, query.limit))
    return results
  }

  async findWorkCenterTemplate(workCenterKey, query) {
    const results = await super.query(aql.FIND_WORKCENTER_TEMPLATE(workCenterKey, query.start, query.limit))
    return results
  }

  async findWorkCenterTemplateUpdateRecord(workCenterKey, templateKey, query) {
    const results = await super.query(aql.FIND_WORKCENTER_TEMPLATE_UPDATERECORD(workCenterKey, templateKey, query.start, query.limit))
    return results
  }

  async pullUpdateRecordStatus(_key, status, user) {
    const updateRecordServices = new UpdateRecordServices()

    const target = await updateRecordServices.get(_key)
    target.status.push(status)
    const data = await updateRecordServices.update(_key, { status: target.status, updateTime: new Date() }, user.uuid)
    return data.new
  }

  async getUpdateRecordWithDeployment(_key) {
    const updateRecordServices = new UpdateRecordServices()
    const deploymentServices = new DeploymentServices()
    const templateServices = new TemplateServices()
    const productionServices = new ProductionServices()
    const dataServices = new DataServices()

    const target = await updateRecordServices.get(_key)
    const deployment = await deploymentServices.get(target.deploymentKey)
    const template = await templateServices.get(deployment.templateKey)
    const production = await productionServices.get(template.productionKey)
    const data = await dataServices.get(deployment.dataKey)

    target.deployment = deployment
    target.template = template
    target.production = production
    target.data = data

    return target
  }

  // deprecated
  async startPreprocess(updateRecordKey, useruuid) {
    const productionServices = new ProductionServices()
    const deploymentServices = new DeploymentServices()
    const templateServices = new TemplateServices()
    const dataServices = new DataServices()
    const updateRecordServices = new UpdateRecordServices()

    const update = await updateRecordServices.get(updateRecordKey)
    const deployment = await deploymentServices.get(update.deploymentKey)
    const template = await templateServices.get(deployment.templateKey)
    const production = await productionServices.get(template.productionKey)
    const data = await dataServices.get(deployment.dataKey)
    const ssmoService = new SsmoService()
    const pre = await ssmoService.preprocess(production.companyKey, production._key, deployment.tag, data.cloudStorageUuid)

    await updateRecordServices.update(updateRecordKey, {
      traceUuid: pre.tmsTraceID
    }, useruuid)
    return pre.tmsTraceID
  }

  // deprecated
  async startTrace(updateRecordKey, useruuid) {
    const updateRecordServices = new UpdateRecordServices()
    const ssmoService = new SsmoService()
    const res = await updateRecordServices.get(updateRecordKey)

    const trace = await ssmoService.trace(res.traceUuid)

    if (trace.success && trace.complete) {
      await updateRecordServices.update(updateRecordKey, {
        cloudStorageUuid: trace.fileID
      }, useruuid)
    }
    return trace
  }

  async updateRenderResult(_key, data, useruuid) {
    const updateRecordServices = new UpdateRecordServices()

    const res = await updateRecordServices.update(_key, {
      traceUuid: data.traceUuid,
      cloudStorageUuid: data.cloudStorageUuid
    }, useruuid)
    return res.new
  }

  async preprocessCheck(query, user) {
    const workcenterKey = user.workcenterKey
    const productionServices = new ProductionServices()
    await productionServices.get(query.production)

    let filter = `FILTER last(item.status) == 'reported'`
    if (query.version) {
      filter = `FILTER deployment.tag == '${query.version}'`
    }

    const deploymentAql = `
    let template = (
      FOR item IN Template
      filter item.productionKey == '${query.production}'
      return item)
    let rel = (
        FOR item IN TP_WC_rel
        filter item.templateKey == template[0]._key
            AND item.workCenterKey == '${workcenterKey}'
            AND item.invalid==false
        return item)
    FOR item IN UpdateRecord
    let deployment = Document('Deployment',item.deploymentKey)
    filter item.TP_WC_relKey == rel[0]._key
    ${filter}
    return {template:template[0],deployment,updateRecord:item}`

    const resData = await this.query(deploymentAql)
    if (resData.count === 0) {
      throw new DataNotFoundException(`version data not found.`)
    }

    return resData
  }
}
