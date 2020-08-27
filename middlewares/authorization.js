import { Authorization, FORBIDDEN } from '../constants'
import { AUTHORIZATION_SETTING_ERROR, JWT_EMPTY_ERROR, OPERATION_NO_PERMITTED } from '../exception/Authorization'
import logger from '../logger'

export default (authArr) => {
  return async (ctx, next) => {
    const user = ctx.state.user
    try {
      let permit = false
      for (const item of authArr) {
        const group = item.group
        const level = item.level
        const check = await auth(group, level, user)
        permit = permit | check
      }
      if (permit) {
        return next()
      } else {
        throw new OPERATION_NO_PERMITTED()
      }
    } catch (err) {
      if (err instanceof AUTHORIZATION_SETTING_ERROR) {
        return ctx.res.forbidden('FORBIDDEN.code', err.message, { err })
      }
      if (err instanceof JWT_EMPTY_ERROR) {
        return ctx.res.forbidden(FORBIDDEN.code, 'User data is empty.', { err })
      }
      if (err instanceof OPERATION_NO_PERMITTED) {
        return ctx.res.forbidden(FORBIDDEN.code, FORBIDDEN.message, { err })
      }
      ctx.log.error({ message: err.message, err })
      return ctx.res.internalServerError(err.name, err.message, { err })
    }
  }
}

const auth = async (group, level, user) => {
  if (!group) {
    throw new AUTHORIZATION_SETTING_ERROR('Authorization setting not correct. \'group\' can not be empty.')
  }
  if (!(group instanceof Array)) {
    throw new AUTHORIZATION_SETTING_ERROR('Authorization setting not correct. \'group\' must be an Array.')
  }
  if (!(typeof level === 'number')) {
    throw new AUTHORIZATION_SETTING_ERROR('Authorization setting not correct. \'level\' must be an Number.')
  }
  level = level || Authorization.ADMIN
  // const user = ctx.state.user
  if (!user) {
    throw new JWT_EMPTY_ERROR()
  }
  logger.debug('user roles', user.roles)
  const roles = user.roles
  const find = roles.find((role) => {
    return arrayEqual(group, role.group) && level <= Authorization[role.roleName]
  })
  if (find) {
    return true
  }
  return false
}

const arrayEqual = (arr1, arr2) => {
  if (arr1 === arr2) {
    return true
  }
  if (arr1 == null || arr2 == null) {
    return false
  }
  if (arr1.length !== arr2.length) {
    return false
  }
  for (var i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}
