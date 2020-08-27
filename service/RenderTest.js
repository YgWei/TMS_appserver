import Services from './Services'
import FileService from './fileService'
import fs from 'fs-extra'
import logger from '../logger'
import * as aql from '../aqlString/RenderTest'
import DeploymentServices from './Deployment'
import SsmoServices from '../util/ssmo'
import { StatusError } from '../exception'

const formatter = {
  find: (data) => {
    return {
      uuid: data.renderTest._key,
      company: data.company.name,
      production: data.production.name,
      template: data.template.name,
      version: data.deployment.tag,
      expiryTime: data.renderTest.expiryTime
    }
  },
  get: (data) => {
    return {
      uuid: data.renderTest._key,
      company: data.company.name,
      production: data.production.name,
      template: data.template.name,
      version: data.deployment.tag,
      expiryTime: data.renderTest.expiryTime,
      createTime: data.renderTest.createTime,
      renderResult: data.renderTest.renderResult,
      renderSrc: data.renderTest.renderSrc
    }
  }
}

export default class RenderTestServices extends Services {
  constructor() {
    super('RenderTest')
  }

  async find(query) {
    const result = await super.query(aql.FIND(query.start, query.limit))
    result.data = result.data.map((item) => {
      return formatter.find(item)
    })
    return result
  }

  async get(uuid) {
    await super.get(uuid)
    const result = await super.query(aql.GET(uuid))
    return formatter.get(result.data[0])
  }

  async createRenderTest(body, file, useruuid) {
    // check deployment is release
    const deploymentServices = new DeploymentServices()
    const res = await deploymentServices.getDeployment(body.deploymentKey)
    if (res.deployment.state !== 'release') {
      throw new StatusError(`deployment ${body.deploymentKey} is not release`)
    }
    // upload render src
    const fileService = new FileService()
    const uploadInfo = await fileService.uploadFiles([file.path], 2)
    // const fileName = file.name
    // const md5 = uploadInfo[0].md5
    const cloudStorageUuid = uploadInfo[0].uuid
    try {
      await fs.unlink(file.path)
    } catch (err) {
      logger.error('Delete unuse file in createRenderTest.', err)
      throw err
    }
    // start preprocess
    const ssmoServices = new SsmoServices()
    let tmsTraceID
    try {
      const data = res.deployment
      const preprocess = await ssmoServices.preprocess(data.company.uuid, data.production.uuid, data.template.tag, cloudStorageUuid)
      tmsTraceID = preprocess.tmsTraceID
    } catch (err) {
      throw new Error(err)
    }

    // save data
    const date = new Date()
    date.setHours(date.getHours() + 2)
    const data = {
      deploymentKey: body.deploymentKey,
      tmsTraceID: tmsTraceID,
      renderSrc: cloudStorageUuid,
      renderResult: '',
      expiryTime: date
    }
    const results = await super.create(data, useruuid)
    return results
  }

  async trace(uuid, useruuid) {
    const renderTest = await super.get(uuid)
    console.log(renderTest)
    if (renderTest.renderResult === '') {
      const ssmoServices = new SsmoServices()
      const render = await ssmoServices.trace(renderTest.tmsTraceID)
      if (render.success && render.complete) {
        await this.update(uuid, { renderResult: render.fileID }, useruuid)
      }
      return render
    } else {
      return {
        success: true,
        complete: true,
        fileID: renderTest.renderResult
      }
    }
  }
}
