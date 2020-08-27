import Joi from '@hapi/joi'

export const findDeploymentResponses = {
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

export const getDeploymentByUuidResponses = {
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

export const createDeploymentResponses = {
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
      message: 'The deployment already exist'
    }
  }
}

export const updateDeploymentResponses = {
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

export const deleteDeploymentResponses = {
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

export const getDeploymentValidation = {
  query: Joi.object({
    start: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().greater(Joi.ref('start')).default(10),
    type: Joi.string(),
    templateUuid: Joi.string(),
    status: Joi.string()
  })
}

export const getDeploymentByUuidValidation = {
  query: Joi.object({
    type: Joi.string()
  }),
  params: Joi.object({
    uuid: Joi.string().required()
  })
}

export const createDeploymentValidation = {
  body: Joi.object({
    companyUuid: Joi.string().required(),
    productionUuid: Joi.string().required(),
    templateUuid: Joi.string().required(),
    branch: Joi.string().required(),
    tag: Joi.string().required(),
    dataUuid: Joi.string().required(),
    note: Joi.string().required()
  })
}

export const createDeployment = {
  companyUuid: {
    type: 'string',
    required: true
  },
  productionUuid: {
    type: 'string',
    required: true
  },
  templateUuid: {
    type: 'string',
    required: true
  },
  tag: {
    type: 'string',
    required: true
  },
  branch: {
    type: 'string',
    required: true
  },
  dataUuid: {
    type: 'string',
    required: true
  },
  note: {
    type: 'string',
    required: true
  }
}

export const deleteDeploymentValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  })
}

export const initiateReviewValidation = {
  body: Joi.object({
    reviewUser: Joi.string().guid({
      version: [
        'uuidv4'
      ]
    }).required(),
    customer: Joi.string().guid({
      version: [
        'uuidv4'
      ]
    }).required(),
    reviewGroup: Joi.array().items(
      Joi.string().guid({
        version: [
          'uuidv4'
        ]
      }).required()
    ),
    startTime: Joi.string().required(),
    endTime: Joi.string().required()
  })
}

export const initiateReviewDeployment = {
  reviewUser: {
    type: 'string',
    example: 'useruuid',
    required: true
  },
  customer: {
    type: 'string',
    example: 'useruuid',
    required: true
  },
  reviewGroup: {
    type: 'array',
    items: {
      type: 'string',
      example: 'useruuid...',
      required: true
    }
  },
  startTime: {
    type: 'string',
    example: '2020-01-01T00:00:00.000Z',
    required: true
  },
  endTime: {
    type: 'string',
    example: '2020-01-01T00:00:00.000Z',
    required: true
  }
}

export const initiateReviewResponses = {
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
      message: 'The deployment already exist'
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

export const updateDeployStatusValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  })
}

export const updateDeployStatus = {
  state: {
    type: 'string',
    required: true
  }
}

export const updateDeploymentValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  }),
  body: Joi.object({
    note: Joi.string().required()
  })
}

export const updateDeployment = {
  note: {
    type: 'string',
    required: true
  }
}

export const getTagValidation = {
  query: Joi.object({
    tag: Joi.string().required(),
    templateUuid: Joi.string().required()
  })
}

export const getDeploymentReviewRecord = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {
        count: 1,
        data: [{
          uuid: 'uuid',
          user: {
            uuid: 'user.uuid',
            name: 'user.name'
          },
          time: 'modifyTime',
          result: 'result',
          message: 'message'
        }]
      },
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
