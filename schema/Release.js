import Joi from '@hapi/joi'

export const findReleaseResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
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
      message: 'Operation not permitted'
    }
  }
}

export const getReleaseByUuidResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
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
      message: 'Operation not permitted'
    }
  },
  404: {
    description: 'not found',
    example: {
      state: 'FAIL',
      code: 'NOT_FOUND',
      message: 'Get data by uuid not found'
    }
  }
}

export const createReleaseResponses = {
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

export const updateReleaseResponses = {
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
      message: 'Operation not permitted'
    }
  },
  404: {
    description: 'not found',
    example: {
      state: 'FAIL',
      code: 'NOT_FOUND',
      message: 'Get data by uuid not found'
    }
  }
}

export const deleteReleaseResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
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
      message: 'Operation not permitted'
    }
  },
  404: {
    description: 'not found',
    example: {
      state: 'FAIL',
      code: 'NOT_FOUND',
      message: 'Get data by uuid not found'
    }
  }
}

export const findReleaseValidation = {
  query: Joi.object({
    start: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().greater(Joi.ref('start')).default(10),
    templateUuid: Joi.string()
  })
}

export const getReleaseByUuidValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  })
}

export const createReleaseValidation = {
  body: Joi.object({
    deploymentUuid: Joi.string().required()
  })
}

export const createRelease = {
  deploymentUuid: {
    type: 'string',
    required: true
  }
}

export const deleteReleaseValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  })
}

export const releaseTreeValidation = {
  query: Joi.object({
    select: Joi.string().valid('root', 'company', 'production', 'template', 'deployment', 'data').required(),
    companyUuid: Joi.string(),
    productionUuid: Joi.string(),
    templateUuid: Joi.string(),
    deploymentUuid: Joi.string(),
    dataUuid: Joi.string()
  })
}

export const createReleaseV2 = {
  templateUuid: { type: 'string', required: true },
  deploymentUuid: { type: 'string', required: true },
  workCenters: { type: 'array', required: true, items: { type: 'string', required: true } },
  startTime: { type: 'string', required: true },
  note: { type: 'string', required: true }
}

export const createReleaseV2Validation = {
  body: Joi.object({
    templateUuid: Joi.string().required(),
    deploymentUuid: Joi.string().required(),
    workCenters: Joi.array().items(Joi.string().required()).required(),
    startTime: Joi.string().required(),
    note: Joi.string().required()
  })
}
