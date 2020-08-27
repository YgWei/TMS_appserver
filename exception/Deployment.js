export class DEPLOYMENT_STATE_ERROR extends Error {
  constructor(message, data) {
    super()
    this.status = 403
    this.name = 'DEPLOYMENT_STATE_ERROR'
    this.message = message || 'Deployment state error'
    this.stack = (new Error()).stack
    this.data = data
  }
}
