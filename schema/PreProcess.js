import Joi from '@hapi/joi'

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
