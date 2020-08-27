import Joi from '@hapi/joi'

export const findWorkCenterResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get workcenter list'
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

export const getWorkCenterByUuidResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get the targeted workcenter'
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

export const getWorkCenterTemplateByUuidResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get the targeted workcenter'
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

export const createWorkCenterResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get the targeted workcenter'
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
      message: 'The workcenter already exist'
    }
  }
}

export const updateWorkCenterResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success update the targeted workcenter'
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

export const deleteWorkCenterResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success delete the targeted workcenter'
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

export const findWorkCenterValidation = {
  query: Joi.object({
    start: Joi.number().required(),
    limit: Joi.number().required(),
    type: Joi.string()
  })
}

export const getWorkCenterByUuidValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  }),
  query: Joi.object({
    start: Joi.number(),
    limit: Joi.number()
  })
}
export const getWorkCenterTemplateByUuidValidation = {
  params: Joi.object({
    workCenterUuid: Joi.string().required()
  }),
  query: Joi.object({
    start: Joi.number(),
    limit: Joi.number(),
    type: Joi.string().valid('list', 'select')
  })
}

export const createWorkCenterValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    region: Joi.string().required()
  })
}

export const updateWorkCenterValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string(),
    region: Joi.string()
  })
}

export const deleteWorkCenterValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  })
}

export const createWorkCenterTemplateValidation = {
  params: Joi.object({
    workcenterUuid: Joi.string().required()
  }),
  body: Joi.object({
    templateUuid: Joi.string()
  })
}

export const deketeWorkCenterTemplateValidation = {
  params: Joi.object({
    workcenterUuid: Joi.string().required(),
    templateUuid: Joi.string().required()
  })
}

export const deketeWorkCenterTemplateResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success delete the targeted workcenter'
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

export const createProductOwnerValidation = {
  params: Joi.object({
    workCenterUuid: Joi.string().required()
  }),
  body: Joi.object({
    templateUuid: Joi.string(),
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string()
  })
}

export const updateProductOwnerValidation = {
  params: Joi.object({
    workCenterUuid: Joi.string().required(),
    uuid: Joi.string()
  }),
  body: Joi.object({
    templateUuid: Joi.string(),
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string()
  })
}

export const findProductOwnerValidation = {
  params: Joi.object({
    workCenterUuid: Joi.string().required()
  }),
  body: Joi.object({
    start: Joi.number(),
    limit: Joi.number()
  })
}

export const deleteProductOwnerValidation = {
  params: Joi.object({
    workCenterUuid: Joi.string().required(),
    uuid: Joi.string().required()
  })
}

export const findUpdateRecordValidation = {
  params: Joi.object({
    workCenterUuid: Joi.string().required()
  })
}

export const createWorkCenterTemplateResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get the targeted workcenter'
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
      message: 'The workcenter already exist'
    }
  }
}

export const createProductOwnerResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get the targeted workcenter'
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
      message: 'The workcenter already exist'
    }
  }
}

export const findProductOwnerResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get the targeted workcenter'
    }
  },
  401: {
    description: 'jwt fail',
    example: {
      state: 'FAIL',
      code: 'JWT_AUTHENTICATION_ERROR',
      message: 'JWT Token illegal'
    }
  }
}

export const deleteProductOwnerResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get the targeted workcenter'
    }
  },
  401: {
    description: 'jwt fail',
    example: {
      state: 'FAIL',
      code: 'JWT_AUTHENTICATION_ERROR',
      message: 'JWT Token illegal'
    }
  }
}

export const updateProductOwnerResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get the targeted workcenter'
    }
  },
  401: {
    description: 'jwt fail',
    example: {
      state: 'FAIL',
      code: 'JWT_AUTHENTICATION_ERROR',
      message: 'JWT Token illegal'
    }
  }
}
