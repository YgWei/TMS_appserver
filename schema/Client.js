import Joi from '@hapi/joi'

export const findWorkCenterUpdateRecordResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get company list'
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

export const findWorkCenterTemplateResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get company list'
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

export const findTemplateUpdateRecordResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get company list'
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

export const updateStatusOfUpdateRecordResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get company list'
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

export const getUpdateRecordStateResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success get company list'
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

export const findWorkCenterUpdateRecordValidation = {
  params: Joi.object({
    workCenterKey: Joi.string().required()
  }),
  query: Joi.object({
    start: Joi.number().required(),
    limit: Joi.number().required()
  })
}

export const findWorkCenterTemplateValidation = {
  params: Joi.object({
    workCenterKey: Joi.string().required()
  }),
  query: Joi.object({
    start: Joi.number().required(),
    limit: Joi.number().required()
  })
}

export const findTemplateUpdateRecordValidation = {
  params: Joi.object({
    workCenterKey: Joi.string().required(),
    templateKey: Joi.string().required()
  }),
  query: Joi.object({
    start: Joi.number().required(),
    limit: Joi.number().required()
  })
}

export const updateStatusOfUpdateRecordValidation = {
  params: Joi.object({
    updateRecordKey: Joi.string().required()
  }),
  body: Joi.object({
    status: Joi.string().required()
  })
}

export const getUpdateRecordStateValidation = {
  params: Joi.object({
    updateRecordKey: Joi.string().required()
  })
}

export const checkDataResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}

export const checkDataValidate = {
  query: Joi.object({
    company: Joi.string().required(),
    production: Joi.string().required(),
    version: Joi.string()
  })
}
