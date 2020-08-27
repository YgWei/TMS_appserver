/**
 * Client Failures
 */
export const UNKNOWN_ENDPOINT = {
  code: 'UNKNOWN_ENDPOINT',
  message: 'The requested endpoint does not exist.'
}

export const INVALID_REQUEST = {
  code: 'INVALID_REQUEST',
  message: 'The request has invalid parameters.'
}

export const FORBIDDEN = {
  code: 'FORBIDDEN',
  message: 'Operation not permitted.'
}

/**
 * Server Errors
 */
export const INTERNAL_ERROR = {
  code: 'INTERNAL_ERROR',
  message: 'The server encountered an internal error.'
}

export const UNKNOWN_ERROR = {
  code: 'UNKNOWN_ERROR',
  message: 'The server encountered an unknown error.'
}

/**
* jwt fail
*/
export const JWT_AUTHENTICATION_ERROR = {
  code: 'JWT_AUTHENTICATION_ERROR',
  message: 'JWT Token illegal'
}

export const NOT_FOUND = {
  code: 'NOT_FOUND',
  message: `Get data by uuid not found.`
}

export const NOT_UNIQUE = {
  code: 'NOT_UNIQUE',
  message: `Get data by uuid not unique.`
}

export const SUCCESS = {
  code: 'SUCCESS',
  message: 'success.'
}

export const Authorization = {
  ROOT: 10,
  ADMIN: 5,
  MANERAGER: 4,
  USER: 3,
  VIEWER: 2,
  GUEST: 1
}
