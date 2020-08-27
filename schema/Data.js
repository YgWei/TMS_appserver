import Joi from '@hapi/joi'

export const findDataResponses = {
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

export const getDataByUuidResponses = {
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

export const createDataResponses = {
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
    description: 'file data already exist',
    example: {
      state: 'FAIL',
      code: 'FORBIDDEN',
      message: 'The data already exist'
    }
  }
}

export const updateDataResponses = {
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

export const deleteDataResponses = {
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

export const findDataValidation = {
  query: Joi.object({
    start: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().greater(Joi.ref('start')).default(10),
    type: Joi.string().required(),
    name: Joi.string(),
    companyUuid: Joi.string(),
    productionUuid: Joi.string()
  })
}

export const getDataByUuidValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  })
}

export const createDataValidation = {
  body: Joi.object({
    companyUuid: Joi.string().required(),
    productionUuid: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required()
  }),
  files: Joi.object({
    file: Joi.required()
  })
}

export const createData = {
  companyUuid: {
    type: 'string',
    required: true
  },
  productionUuid: {
    type: 'string',
    required: true
  },
  name: {
    type: 'string',
    required: true
  },
  description: {
    type: 'string',
    required: true
  },
  file: {
    type: 'file',
    required: true,
    description: 'upload file'
  }
}

export const deleteDataValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  })
}

export const updateDataValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  }),
  body: Joi.object({
    companyUuid: Joi.string(),
    productionUuid: Joi.string(),
    name: Joi.string(),
    description: Joi.string()
  })
}

export const updateData = {
  companyUuid: {
    type: 'string'
  },
  productionUuid: {
    type: 'string'
  },
  description: {
    type: 'string'
  },
  name: {
    type: 'string'
  }
}
