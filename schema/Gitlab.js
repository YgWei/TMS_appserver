import Joi from '@hapi/joi'

export const findProjectsResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}

export const findProjectsValidate = {
  query: Joi.object({
    start: Joi.number().required(),
    limit: Joi.number().required()
  })
}

export const findBranchesValidate = {
  params: Joi.object({
    projectId: Joi.number().required()
  }),
  query: Joi.object({
    start: Joi.number().required(),
    limit: Joi.number().required()
  })
}

export const findBranchesResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}

export const createTagValidate = {
  params: Joi.object({
    projectId: Joi.number().required()
  }),
  query: Joi.object({
    tag: Joi.string().required(),
    commitId: Joi.string().required()
  })
}

export const createTagResponses = {
  200: {
    description: 'success',
    example: {
      state: 'SUCCESS',
      data: {},
      message: 'success'
    }
  }
}
