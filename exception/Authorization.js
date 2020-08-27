export class AUTHORIZATION_SETTING_ERROR extends Error {
  constructor(message) {
    super()
    this.name = 'AUTHORIZATION_SETTING_ERROR'
    this.message = message || 'authorization setting error.'
    this.stack = (new Error()).stack
  }
}

export class JWT_EMPTY_ERROR extends Error {
  constructor(message) {
    super()
    this.name = 'JWT_EMPTY_ERROR'
    this.message = message || 'Jwt is empty.'
    this.stack = (new Error()).stack
  }
}

export class OPERATION_NO_PERMITTED extends Error {
  constructor(message) {
    super()
    this.name = 'OPERATION_NO_PERMITTED'
    this.message = message || 'operation no permitted'
    this.stack = (new Error()).stack
  }
}
