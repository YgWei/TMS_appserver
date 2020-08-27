import Joi from '@hapi/joi'

export const findCompanyResponses = {
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

export const getCompanyByUuidResponses = {
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
  },
  500: {
    description: 'internal service error',
    example: {
      state: 'FAIL',
      code: 'INTERNAL_ERROR',
      message: 'The server encountered an internal error'
    }
  }
}

export const createCompanyResponses = {
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
      message: 'The company already exist'
    }
  }
}

export const updateCompanyResponses = {
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

export const deleteCompanyResponses = {
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
    description: 'permission not allowed',
    example: {
      state: 'FAIL',
      code: 'PERMISSION_NOT_ALLOWED',
      message: 'You have no permission'
    }
  },
  404: {
    description: 'page not found',
    example: {
      state: 'FAIL',
      code: 'PAGE_NOT_FOUND',
      message: 'Check the targeted page server or uuid'
    }
  },
  500: {
    description: 'internal service error',
    example: {
      state: 'FAIL',
      code: 'INTERNAL_ERROR',
      message: 'The server encountered an internal error'
    }
  }
}

export const createCompanyValidation = {
  body: Joi.object({
    name: Joi.string().required()
  })
}

export const createCompany = {
  name: {
    type: 'string',
    required: true
  }
}

export const updateCompanyValidation = {
  body: Joi.object({
    name: Joi.string()
  })
}

export const updateCompany = {
  name: {
    type: 'string'
  }
}
