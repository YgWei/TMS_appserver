import Joi from '@hapi/joi'

export const findNotifyResponses = {
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

export const getNotifyByUuidResponses = {
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

export const createNotifyResponses = {
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
      message: 'The notify already exist'
    }
  }
}

export const updateNotifyResponses = {
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

export const deleteNotifyResponses = {
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

export const findNotifyValidation = {
  query: Joi.object({
    start: Joi.number().required(),
    limit: Joi.number().required(),
    type: Joi.string()
  })
}

export const createNotifyValidation = {
  body: Joi.object({
    from: Joi.string().required(),
    toUuid: Joi.string().required(),
    type: Joi.string().valid('update', 'review'),
    content: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    data: Joi.object()
  })
}

export const createNotify = {
  from: {
    type: 'string',
    required: true
  },
  toUuid: {
    type: 'string',
    required: true
  },
  type: {
    type: 'string',
    enum: ['update', 'review'],
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  startTime: {
    type: 'date',
    required: true
  },
  endTime: {
    type: 'date',
    required: true
  },
  data: {
    type: 'object',
    required: true,
    properties: {
      deploymentUuid: { type: 'string', example: '8559ca90-XXXX-47de-XXXX-9df3e5979415' },
      reviewUuid: { type: 'string', example: '8559ca90-XXXX-47de-XXXX-9df3e5979415' }
    }
  }
}

export const updateNotifyValidation = {
  body: Joi.object({
    from: Joi.string().required(),
    toUuid: Joi.string().required(),
    type: Joi.string().valid('update', 'review'),
    content: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required()
  })
}

export const updateNotify = {
  from: {
    type: 'string',
    required: true
  },
  toUuid: {
    type: 'string',
    required: true
  },
  type: {
    type: 'string',
    enum: ['update', 'review'],
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  startTime: {
    type: 'date',
    required: true
  },
  endTime: {
    type: 'date',
    required: true
  }
}

export const submitNotifyReviewValidation = {
  body: Joi.object({
    result: Joi.string().required(),
    message: Joi.string().required()
  })
}

export const submitNotifyReviewResponses = {
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
