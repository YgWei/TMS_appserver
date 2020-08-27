export class GitlabLoginError extends Error {
  constructor(message) {
    super()
    this.name = 'GitlabLoginError'
    this.message = message || 'Gitlab login fail.'
    this.stack = (new Error()).stack
  }
}
