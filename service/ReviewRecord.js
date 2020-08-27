import Services from './Services'
import uuidV4 from 'uuid/v4'

const createMessage = (data, user) => ({
  uuid: uuidV4(),
  type: data.type,
  user: data.user,
  reviewUuid: data.reviewUuid,
  deploymentUuid: data.deploymentUuid,
  notifyUuid: data.notifyUuid,
  message: data.message,
  result: data.result,
  createTime: new Date(),
  modifyTime: new Date(),
  createUser: user || 'admin',
  modifyUser: user || 'admin'
})

export default class ReviewRecordServices extends Services {
  constructor() {
    super('ReviewRecord', createMessage)
  }
}
