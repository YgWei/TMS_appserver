import Services from './Services'
import logger from '../logger'
import uuidV4 from 'uuid/v4'
import Authorization from '../util/Authorization'
import UserServices from './User'
import ReviewRecord from './ReviewRecord'
import { DataDuplicateException, StatusError } from '../exception'
import NotifyServices from './Notify'
import _ from 'lodash'
import DeploymentServices from './Deployment'

const formatter = {
  forDeployment: (data) => {
    return {
      reviewUser: data.reviewUser,
      reviewGroup: data.reviewGroup,
      customer: data.customer,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status
    }
  }
}

const createReview = (data, user) => ({
  uuid: uuidV4(),
  reviewUser: data.reviewUser,
  reviewGroup: data.reviewGroup,
  customer: data.customer,
  startTime: data.startTime,
  endTime: data.endTime,
  status: data.status,
  companyUuid: data.companyUuid,
  productionUuid: data.productionUuid,
  templateUuid: data.templateUuid,
  dataUuid: data.dataUuid,
  deploymentUuid: data.deploymentUuid,
  createTime: new Date(),
  modifyTime: new Date(),
  createUser: user || 'admin',
  modifyUser: user || 'admin'
})

export default class ReviewServices extends Services {
  constructor() {
    super('Review', createReview)
  }

  async getReview(_key) {
    const userServices = new UserServices()
    const review = await this.get(_key)
    review.reviewUser = await userServices.getUser(review.reviewUser)
    const reviewGroupUsers = []
    for (const item of review.reviewGroup) {
      const user = await userServices.getUser(item)
      reviewGroupUsers.push(user)
    }
    review.reviewGroup = reviewGroupUsers
    review.customer = await userServices.getUser(review.customer)
    return formatter.forDeployment(review)
  }

  async startReview(deploymentUuid, data, useruuid) {
    const authorization = new Authorization()
    const deploymentServices = new DeploymentServices()
    const deployment = await deploymentServices.get(deploymentUuid)
    if (!deployment.traceUuid || deployment.status[deployment.status.length - 1] !== 'deploy_success') {
      throw new StatusError('deploy state not correct')
    }
    if (deployment.traceUuid && deployment.renderResult === '') {
      const trace = await deploymentServices.deployRenderResult(deploymentUuid, useruuid)
      if (!trace.complete || !trace.success) {
        throw new StatusError('render state not correct')
      }
    }
    const reviewData = (depolymentKey) => {
      return {
        reviewUser: data.reviewUser,
        reviewGroup: data.reviewGroup,
        customer: data.customer,
        startTime: data.startTime,
        endTime: data.endTime,
        status: ['init'],
        deploymentKey: depolymentKey,
        createTime: new Date(),
        modifyTime: new Date(),
        createUser: useruuid,
        modifyUser: useruuid,
        invalid: false
      }
    }

    let notifyUsers = []
    notifyUsers.push(data.reviewUser)
    notifyUsers.push(data.customer)
    for (const user of data.reviewGroup) {
      notifyUsers.push(user)
    }

    // 移除notifyUsers中重複的值
    notifyUsers = _.uniq(notifyUsers)
    logger.debug('notifyUsers', notifyUsers)

    for (const useruuid of notifyUsers) {
      const user = await authorization.getUser(useruuid)
      logger.debug(`User ${user.uuid} is exit`)
    }
    // TODO : 1. 修改 content
    const notify = (toUseruuid, reviewKey, reviewRecordKey) => {
      return {
        from: useruuid,
        to: toUseruuid,
        type: 'review',
        content: '請執行質檢',
        startTime: data.startTime,
        endTime: data.endTime,
        reviewKey: reviewKey,
        reviewRecordKey: reviewRecordKey,
        createTime: new Date(),
        modifyTime: new Date(),
        createUser: useruuid,
        modifyUser: useruuid,
        invalid: false
      }
    }

    const reviewRecordData = (reviewKey, toUseruuid) => {
      return {
        reviewKey: reviewKey,
        useruuid: toUseruuid,
        isReview: false,
        message: '',
        result: '',
        createTime: new Date(),
        modifyTime: new Date(),
        createUser: useruuid,
        modifyUser: useruuid,
        invalid: false
      }
    }

    const db = this.db
    const Deployment = db.collection('Deployment')
    const Review = db.collection('Review')
    const Notify = db.collection('Notify')
    const ReviewRecord = db.collection('ReviewRecord')
    const trx = await db.beginTransaction({
      read: [Deployment],
      write: [Deployment, Review, Notify, ReviewRecord]
    })

    const createReview = await trx.run(() => Review.save(reviewData(deploymentUuid)))

    const updateDeploymentData = {
      status: ['init', 'deploy', 'deploy_success', 'review'],
      reviewKey: createReview._key
    }

    await trx.run(() => Deployment.update(deploymentUuid, updateDeploymentData))
    logger.debug('review', createReview)
    for (const useruuid of notifyUsers) {
      const reviewRecord = await trx.run(() => ReviewRecord.save(reviewRecordData(createReview._key, useruuid)))
      await trx.run(() => Notify.save(notify(useruuid, createReview._key, reviewRecord._key)))
    }
    await trx.commit()

    return createReview
  }

  async addReviewGroup(_key, reviewGroupUuids, user) {
    const userServices = new UserServices()
    const reviewRecord = new ReviewRecord()
    const notifyServices = new NotifyServices()

    const target = await super.get(_key)

    for (const reviewGroupUuid of reviewGroupUuids) {
      await userServices.getUser(reviewGroupUuid) // check user correct
      if (target.reviewGroup.includes(reviewGroupUuid)) { // check duplicate user
        throw new DataDuplicateException(reviewGroupUuids[0])
      }
    }

    for (const reviewGroupUuid of reviewGroupUuids) {
      target.reviewGroup.push(reviewGroupUuid)
      const reviewRecordData = {
        useruuid: reviewGroupUuid,
        isReview: false,
        reviewKey: _key,
        message: '',
        result: ''
      }
      const newReviewRecord = await reviewRecord.create(reviewRecordData, user.uuid)

      const nodifyData = {
        from: user.uuid,
        to: reviewGroupUuid,
        type: 'review',
        content: '請執行質檢',
        startTime: target.startTime,
        endTime: target.endTime,
        reviewKey: _key,
        reviewRecordKey: newReviewRecord.new._key
      }
      await notifyServices.create(nodifyData, user.uuid)
    }
    const data = await super.update(_key, { reviewGroup: target.reviewGroup }, user.uuid)

    const reviewGroupUsers = []
    for (const item of data.new.reviewGroup) {
      const user = await userServices.getUser(item)
      reviewGroupUsers.push(user)
    }
    data.new.reviewGroup = reviewGroupUsers

    return data.new
  }

  async setReviewResult(deploymentKey, result, useruuid) {
    let resultStr = 'review_reject'
    if (result) {
      resultStr = 'review_accept'
    }
    // set review status
    // set deployment status
    const db = this.db
    const Deployment = db.collection('Deployment')
    const Review = db.collection('Review')
    const trx = await db.beginTransaction({
      read: [Deployment],
      write: [Deployment, Review]
    })

    const deployment = await trx.run(() => Deployment.document(deploymentKey))
    if (deployment.status[deployment.status.length - 1] !== 'review') {
      throw new StatusError()
    }
    logger.debug('setReviewResult deployment', deployment)
    deployment.status.push(resultStr)
    deployment.modifyTime = new Date()
    deployment.modifyUser = useruuid
    await trx.run(() => Deployment.update(deploymentKey, deployment))
    const review = await trx.run(() => Review.document(deployment.reviewKey))
    logger.debug('setReviewResult review', review)
    review.status.push(resultStr)
    review.modifyTime = new Date()
    review.modifyUser = useruuid
    await trx.run(() => Review.update(deployment.reviewKey, review))

    await trx.commit()
    return 'success'
  }
}
