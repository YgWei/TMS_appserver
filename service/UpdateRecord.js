import Services from './Services'
import uuidV4 from 'uuid/v4'
import ReleaseServices from './Release'
import WorkCenterServices from './WorkCenter'
import TpwcrelServices from './TP_WC_rel'
import TemplatelServices from './Template'
import DeploymentServices from './Deployment'
import ProductionOwnerServices from './ProductOwner'
import * as aql from '../aqlString/updateRecord'
import { DEPLOYMENT_STATUS_NOT_RELEASE } from '../exception/UpdateRecord'

const formatter = {
  list: (data) => {
    return {
      uuid: data.updateRecord._key,
      workCenter: data.workcenter.name,
      template: data.template.name,
      templateVersion: data.deployment.tag,
      startTime: data.updateRecord.startTime,
      createTime: data.updateRecord.createTime,
      state: data.updateRecord.status[data.updateRecord.status.length - 1]
    }
  },
  all: (data) => {
    return {
      uuid: data.updateRecord._key,
      template: data.template.name,
      templateVersion: data.deployment.tag,
      createTime: data.updateRecord.createTime,
      startTime: data.updateRecord.startTime,
      workCenter: data.workcenter.name,
      state: data.updateRecord.status[data.updateRecord.status.length - 1],
      cloudStorageUuid: data.updateRecord.cloudStorageUuid,
      note: data.updateRecord.note,
      productOwner: {
        name: data.productOwner.name,
        phone: data.productOwner.phone,
        email: data.productOwner.email
      }
    }
  }
}

const createMessage = (data, user) => ({
  uuid: uuidV4(),
  tpwcRelUuid: data.tpwcRelUuid,
  releaseUuid: data.releaseUuid,
  startTime: data.startTime,
  endTime: data.endTime,
  state: '',
  createTime: new Date(),
  modifyTime: new Date(),
  createUser: user || 'admin',
  modifyUser: user || 'admin'
})

export default class MessageServices extends Services {
  constructor() {
    super('UpdateRecord', createMessage)
  }

  async findUpdateRecord(query) {
    const start = query.start
    const limit = query.limit
    const res = await super.query(aql.FIND_UPDATE_RECORDS(start, limit))
    const templateBody = {
      count: res.count,
      data: res.data.map((item) => {
        return formatter.list(item)
      })
    }
    return templateBody
  }

  async findUpdateRecordByUuid(uuid) {
    const workcenterServices = new WorkCenterServices()
    const tpwcrelServices = new TpwcrelServices()
    const templateServices = new TemplatelServices()
    const deploymentServices = new DeploymentServices()
    const productionOwnerServices = new ProductionOwnerServices()

    const updateRecord = await this.get(uuid)
    const deployment = await deploymentServices.get(updateRecord.deploymentKey)
    const template = await templateServices.get(deployment.templateKey)
    const tpwcrel = await tpwcrelServices.get(updateRecord.TP_WC_relKey)
    const workcenter = await workcenterServices.get(tpwcrel.workCenterKey)
    const productOwner = await productionOwnerServices.findProductOwnerByTPWCrel(tpwcrel._key)

    const updateData = formatter.all({ deployment, template, updateRecord, workcenter, productOwner: productOwner.data[0] })

    return updateData
  }

  async createTemplate(body, user) {
    const releaseServices = new ReleaseServices()
    const workcenterServices = new WorkCenterServices()
    const tpwcrelServices = new TpwcrelServices()

    // check data correct
    const deployment = await releaseServices.getRelease(body.releaseUuid)
    if (deployment.status[deployment.status.length - 1] !== 'release') {
      throw DEPLOYMENT_STATUS_NOT_RELEASE()
    }
    let data = null
    for (const i of body.workCenters) {
      await workcenterServices.getWorkCenter(i)
      const tpwcrel = await tpwcrelServices.getTpwcrelKey(body.templateUuid, i)
      const updateRecordBody = {
        TP_WC_relKey: tpwcrel.data[0]._key,
        deploymentKey: deployment.uuid,
        startTime: body.startTime,
        status: ['init'],
        updateTime: '',
        cloudStorageUuid: '',
        note: body.note
      }

      data = await super.create(updateRecordBody, user)
    }

    return data.new
  }
}
