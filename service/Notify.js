import Services from './Services'
import * as aql from '../aqlString/notify'
import { DataNotFoundException } from '../exception'

const formatter = {
  all: (data) => {
    return {
      uuid: data.notify._key,
      company: data.company.name,
      production: data.production.name,
      template: data.template.name,
      deployment: data.deployment.name,
      templateVersion: data.deployment.tag,
      cloudStorageUuid: data.deployment.renderResult,
      endTime: data.notify.endTime,
      state: data.reviewRecord.state
    }
  },
  getByUuid: (data) => {
    return {
      uuid: data.notify._key,
      company: data.company.name,
      production: data.production.name,
      template: data.template.name,
      version: data.deployment.tag,
      renderResult: data.deployment.renderResult,
      startTime: data.notify.startTime,
      endTime: data.notify.endTime,
      reviewState: data.reviewRecord.result,
      reviewMessage: data.reviewRecord.message
    }
  },
  findByPersonal: (data) => {
    return {
      uuid: data.notify._key,
      company: data.company.name,
      production: data.production.name,
      template: data.template.name,
      templateVersion: data.deployment.tag,
      startTime: data.notify.startTime,
      endTime: data.notify.endTime,
      reviewState: data.reviewRecord.result,
      reviewMessage: data.reviewRecord.message,
      state: data.reviewRecord.isReview
    }
  }
}

export default class NotifyServices extends Services {
  constructor() {
    super('Notify')
  }

  async findNotify(start, limit) {
    const res = await this.query(aql.FIND_NOTIFY(start, limit))
    res.data = res.data.map((item) => {
      return formatter.all(item)
    })
    return res
  }

  async getNotify(uuid) {
    const find = await this.query(aql.GET_NOTIFY_BY_UUID(uuid))
    if (find.count === 0) {
      throw new DataNotFoundException()
    }
    const data = find.data[0]

    return formatter.getByUuid(data)
  }

  async findPersonalNotify(useruuid, query = {}) {
    const type = query.type
    const start = query.start | 0
    const limit = query.limit | 10
    const find = await this.query(aql.FIND_PERSONAL_REVIEW_NOTIFY(useruuid, type, start, limit))

    find.data = find.data.map((item) => {
      return formatter.findByPersonal(item)
    })
    return find
  }

  async submit(uuid, result, message, useruuid) {
    const notify = await this.get(uuid)
    const notifyData = {
      review: true,
      modifyTime: new Date(),
      modifyUser: useruuid
    }
    const reviewRecordData = {
      isReview: true,
      message: message,
      result: result,
      modifyTime: new Date(),
      modifyUser: useruuid
    }

    const db = this.db
    const Notify = db.collection('Notify')
    const ReviewRecord = db.collection('ReviewRecord')
    const trx = await db.beginTransaction({
      write: [Notify, ReviewRecord]
    })
    await trx.run(() => Notify.update(uuid, notifyData))
    const res = await trx.run(() => ReviewRecord.update(notify.reviewRecordKey, reviewRecordData, { returnNew: true }))

    await trx.commit()
    return res.new
  }
}
