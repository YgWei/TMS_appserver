import Joi from '@hapi/joi'

export const findUpdateRecordResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}

export const getUpdateRecordByUuidResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}

export const createUpdateRecordResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  },
  400: {
    description: 'invalid request',
    example: {
      state: 'FAIL',
      code: 'INVALID_REQUEST',
      message: 'The request has invalid parameters'
    }
  },
  401: {
    description: 'jwt fail',
    example: {
      state: 'FAIL',
      code: 'JWT_AUTHENTICATION_ERROR',
      message: 'JWT Token illegal'
    }
  },
  403: {
    description: 'forbidden',
    example: {
      state: 'FAIL',
      code: 'FORBIDDEN',
      message: 'The release already exist'
    }
  }
}

export const updateUpdateRecordResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}

export const deleteUpdateRecordResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}

export const getUpdateRecordValidation = {
  query: Joi.object({
    start: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().greater(Joi.ref('start')).default(10)
  })
}

export const getUpdateRecordByUuidValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  })
}

export const createUpdateRecordValidation = {
  body: Joi.object({
    workCenters: Joi.array().items(Joi.string().required()).required(),
    releaseUuid: Joi.string().required(),
    templateUuid: Joi.string().required(),
    startTime: Joi.string().required(),
    note: Joi.string().required()
  })
}
