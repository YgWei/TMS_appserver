export default (schemas, options) => {
  options = {
    ...options,
    abortEarly: false,
    allowUnknown: true
  }

  return async (ctx, next) => {
    if (!schemas) {
      await next()
      return
    }
    for (const key in schemas) {
      if (key === 'params') {
        const { error } = await schemas[key].validate(ctx.params)
        if (error) {
          throw error
        }
      } else {
        const { error } = await schemas[key].validate(ctx.request[key])
        if (error) {
          throw error
        }
      }
    }

    await next()
  }
}
