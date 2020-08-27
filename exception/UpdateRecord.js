export class DEPLOYMENT_STATUS_NOT_RELEASE extends Error {
  constructor(message) {
    super()
    this.name = 'DEPLOYMENT_STATUS_NOT_RELEASE'
    this.message = message || 'Deployment is not release yet'
    this.stack = (new Error()).stack
  }
}
