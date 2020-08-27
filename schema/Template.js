import Joi from '@hapi/joi'

export const findTemplateResponses = {
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

export const getTemplateByUuidResponses = {
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

export const createTemplateResponses = {
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
      message: 'The template already exist'
    }
  }
}

export const updateTemplateResponses = {
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

export const deleteTemplateResponses = {
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

export const findTemplateValidation = {
  query: Joi.object({
    start: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().greater(Joi.ref('start')).default(10),
    type: Joi.string(),
    name: Joi.string(),
    companyUuid: Joi.string(),
    productionUuid: Joi.string()
  })
}

export const getTemplateByUuidValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  })
}

export const createTemplateValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    companyUuid: Joi.string().required(),
    productionUuid: Joi.string().required(),
    projectId: Joi.number().required(),
    type: Joi.string().valid('fop', 'vue'),
    entryPoint: Joi.string().required(),
    description: Joi.string().required(),
    workCenters: Joi.array().items(Joi.string().required()).required()
  })
}

export const createTemplate = {
  name: {
    type: 'string',
    required: true
  },
  companyUuid: {
    type: 'string',
    required: true
  },
  productionUuid: {
    type: 'string',
    required: true
  },
  projectId: {
    type: 'number',
    required: true
  },
  type: {
    type: 'string',
    enum: ['fop', 'vue'],
    required: true
  },
  entryPoint: {
    type: 'string',
    required: true
  },
  description: {
    type: 'string',
    required: true
  },
  workCenters: {
    type: 'array',
    items: {
      type: 'string',
      required: true
    },
    required: true
  }
}

export const updateTemplateValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('fop', 'vue'),
    entryPoint: Joi.string().required(),
    description: Joi.string().required(),
    workCenters: Joi.array().items(Joi.string().required()).required()
  })
}

export const updateTemplate = {
  name: {
    type: 'string',
    required: true
  },
  type: {
    type: 'string',
    enum: ['fop', 'vue'],
    required: true
  },
  entryPoint: {
    type: 'string',
    required: true
  },
  description: {
    type: 'string',
    required: true
  },
  workCenters: {
    type: 'array',
    items: {
      type: 'string',
      required: true
    },
    required: true
  }
}

export const deleteTemplateValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  })
}
