import Joi from '@hapi/joi'

export const addReviewGroupResponses = {
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

export const addReviewGroupValidation = {
  params: Joi.object({
    uuid: Joi.string().required()
  }),
  body: Joi.object({
    userUuid: Joi.array().items(
      Joi.string().required()
    )
  })
}
