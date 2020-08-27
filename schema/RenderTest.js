export const findRenderTestResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {
        uuid: '',
        company: '',
        production: '',
        template: '',
        version: '',
        expiryTime: ''
      },
      message: 'success get RenderTest list'
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

export const getRenderTestResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {
        uuid: '',
        company: '',
        production: '',
        template: '',
        version: '',
        expiryTime: '',
        createTime: '',
        renderResult: '',
        renderSrc: ''
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

export const createRenderTestResponses = {
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
      message: 'FORBIDDEN'
    }
  }
}

export const traceRenderTestResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {
        success: true,
        complete: true,
        fileID: 'fileID'
      },
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
  }
}
