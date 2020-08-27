export class GITLAB_ERROR extends Error {
  constructor(message) {
    super()
    this.name = 'GITLAB_ERROR'
    this.message = message || 'gitlab error'
    this.stack = (new Error()).stack
  }
}
export class TAG_ERROR extends Error {
  constructor(message) {
    super()
    this.name = 'TAG_ERROR'
    this.message = message || 'Tag name is invalid'
    this.stack = (new Error()).stack
  }
}

export class TAG_NOT_UNIQUE extends Error {
  constructor(message) {
    super()
    this.name = 'TAG_NOT_UNIQUE'
    this.message = message || 'Tag is already exist'
    this.stack = (new Error()).stack
  }
}
export class BRANCH_NOT_FOUND extends Error {
  constructor(message) {
    super()
    this.name = 'BRANCH_NOT_FOUND'
    this.message = message || 'Branch not found'
    this.stack = (new Error()).stack
  }
}
