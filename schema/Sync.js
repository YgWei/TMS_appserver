import Joi from '@hapi/joi'

export const findTemplateResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}

export const findReleaseValidate = {
  query: Joi.object({
    templateuuid: Joi.string().required()
  })
}

export const findReleaseResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}
