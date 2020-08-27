export class CompanyAlreadyException extends Error {
  constructor(message) {
    super()
    this.name = 'CompanyAlreadyException'
    this.message = message || 'Company already exist'
    this.stack = (new Error()).stack
  }
}

export class ProductionNameAlreadyException extends Error {
  constructor(message) {
    super()
    this.name = 'ProductionNameAlreadyException'
    this.message = message || 'Production already exist'
    this.stack = (new Error()).stack
  }
}

export class ProductionNotFoundException extends Error {
  constructor(message) {
    super()
    this.name = 'ProductionNotFoundException'
    this.message = message || 'Get data by production uuid not found'
    this.stack = (new Error()).stack
  }
}

export class CompanyNotFoundException extends Error {
  constructor(message) {
    super()
    this.name = 'CompanyNotFoundException'
    this.message = message || 'Company by uuid not found'
    this.stack = (new Error()).stack
  }
}
