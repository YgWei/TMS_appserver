export class WorkCenterNotFoundException extends Error {
  constructor(message) {
    super()
    this.name = 'WorkCenterNotFoundException'
    this.message = message || 'WorkCenter by uuid not found'
    this.stack = (new Error()).stack
  }
}
