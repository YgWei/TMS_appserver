export class DataNotFoundException extends Error {
  constructor(message, data) {
    super()
    this.status = 404
    this.name = 'DataNotFoundException'
    this.message = message ? `${message} not found` : 'Data not found'
    this.stack = (new Error()).stack
    this.data = { _key: data }
  }
}

export class DataNotUniqueException extends Error {
  constructor(message, data) {
    super()
    this.status = 500
    this.name = 'DataNotUniqueException'
    this.message = message ? `${message} not unique.'` : 'Data not unique.'
    this.stack = (new Error()).stack
    this.data = { _key: data }
  }
}

export class DataDuplicateException extends Error {
  constructor(message, data) {
    super()
    this.status = 500
    this.name = 'DataDuplicateException'
    this.message = message ? `${message} already exists.'` : 'Data already exists.'
    this.stack = (new Error()).stack
    this.data = { _key: data }
  }
}

export class DataError extends Error {
  constructor(message, data) {
    super()
    this.status = 500
    this.name = 'DataError'
    this.message = message || 'Data not correct.'
    this.stack = (new Error()).stack
    this.data = data
  }
}

export class DataUpdateError extends Error {
  constructor(message, data) {
    super()
    this.status = 500
    this.name = 'DataUpdateError'
    this.message = message || 'Data update fail.'
    this.stack = (new Error()).stack
    this.data = data
  }
}

export class DataSaveError extends Error {
  constructor(message, data) {
    super()
    this.status = 500
    this.name = 'DataSaveError'
    this.message = message || 'Data save fail.'
    this.stack = (new Error()).stack
    this.data = data
  }
}

export class UploadFaildException extends Error {
  constructor(message) {
    super()
    this.name = 'UploadFaildException'
    this.message = message || 'File Upload faild'
    this.stack = (new Error()).stack
  }
}

export class StatusError extends Error {
  constructor(message) {
    super()
    this.status = 403
    this.name = 'StatusError'
    this.message = message || 'StatusError'
    this.stack = (new Error()).stack
  }
}
