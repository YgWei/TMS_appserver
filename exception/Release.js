export class INPUT_DATA_NOT_COMPLETE extends Error {
  constructor(message) {
    super()
    this.status = 400
    this.name = 'INPUT_DATA_NOT_COMPLETE'
    this.message = `field '${message}' input data not exist.`
    this.stack = (new Error()).stack
  }
}

export class STATUS_NOT_CORRECT extends Error {
  constructor() {
    super()
    this.status = 403
    this.name = 'STATUS_NOT_CORRECT'
    this.message = 'status not correct'
    this.stack = (new Error()).stack
  }
}
