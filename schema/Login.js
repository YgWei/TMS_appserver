import Joi from '@hapi/joi'

export const loginResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}

export const loginValidation = {
  body: Joi.object({
    account: Joi.string().required(),
    password: Joi.string().required()
  })
}
