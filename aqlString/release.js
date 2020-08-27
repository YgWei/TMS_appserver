export const releaseTree = function (query) {
  let queryString = `let results = (For re IN Release FILTER re.invalid == null`
  const params = {}
  if (query.select === 'root') {
    queryString += ` return Distinct(re.companyUuid)) return { results }`
    return {
      query: queryString,
      bindVars: params
    }
  } else if (query.select === 'company') {
    queryString += ` AND re.companyUuid == @companyUuid return Distinct(re.productionUuid)) return { results }`
    params.companyUuid = query.companyUuid
    return {
      query: queryString,
      bindVars: params
    }
  } else if (query.select === 'production') {
    queryString += ` AND re.companyUuid == @companyUuid AND re.productionUuid == @productionUuid return Distinct(re.templateUuid)) return { results }`
    params.companyUuid = query.companyUuid
    params.productionUuid = query.productionUuid
    return {
      query: queryString,
      bindVars: params
    }
  } else if (query.select === 'template') {
    queryString += ` AND re.companyUuid == @companyUuid AND re.productionUuid == @productionUuid AND re.templateUuid == @templateUuid return Distinct(re.deploymentUuid)) return { results }`
    params.companyUuid = query.companyUuid
    params.productionUuid = query.productionUuid
    params.templateUuid = query.templateUuid
    return {
      query: queryString,
      bindVars: params
    }
  } else if (query.select === 'deployment') {
    queryString += ` AND re.companyUuid == @companyUuid AND re.productionUuid == @productionUuid AND re.templateUuid == @templateUuid AND re.deploymentUuid == @deploymentUuid return Distinct(re.dataUuid))
    return {
        results
    }`
    params.companyUuid = query.companyUuid
    params.productionUuid = query.productionUuid
    params.templateUuid = query.templateUuid
    params.deploymentUuid = query.deploymentUuid
    return {
      query: queryString,
      bindVars: params
    }
  }
}
