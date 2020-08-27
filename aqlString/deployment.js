export const FIND_DEPLOYMENT = (templateKey, status, start, limit) => {
  let filter = 'FILTER item.invalid == false '
  if (templateKey) {
    filter += `AND item.templateKey == '${templateKey}'`
  }
  if (status) {
    filter += `AND LAST(item.status) == '${status}'`
  }
  const aqlStr = `
  FOR item IN Deployment
  ${filter}
  let template = Document("Template",item.templateKey)
  let data = Document("Data",item.dataKey)
  let production = Document("Production",template.productionKey)
  let company = Document("Company",production.companyKey)
  SORT item.createTime DESC
  LIMIT ${start},${limit}
  RETURN {deployment: item, template, data, production, company}
  `
  return aqlStr
}

export const FIND_RELEASE_DEPLOYMENT = (templateKey, start, limit) => {
  let filterStr = 'FILTER item.invalid == false AND LAST(item.status) == "release" '
  if (templateKey) {
    filterStr += `AND item.templateKey == '${templateKey}'`
  }

  const aqlString = `
  FOR item IN Deployment
  ${filterStr}
  let template = Document("Template",item.templateKey)
  let data = Document("Data",item.dataKey)
  let production = Document("Production",template.productionKey)
  let company = Document("Company",production.companyKey)
  SORT item.createTime DESC
  LIMIT ${start},${limit}
  RETURN {deployment: item, template, data, production, company}
  `
  return aqlString
}

export const FIND_RELEASE_DATA = (deploymentKey, start, limit) => {
  const aqlString = `
  let deployment = Document("Deployment/${deploymentKey}")
  let template = Document("Template",deployment.templateKey)
  let data = Document("Data",deployment.dataKey)
  let production = Document("Production",template.productionKey)
  let company = Document("Company",production.companyKey)
  LIMIT ${start},${limit}
  RETURN {deployment, template, data, production, company}
  `
  return aqlString
}

export const SELECT_RELEASE_DEPLOYMENT = (templateKey, start, limit) => {
  let filter = `FILTER item.invalid == false AND LAST(item.status) == "release"`
  if (templateKey) {
    filter += ` AND item.templateKey == '${templateKey}'`
  }
  const aqlString = `
  FOR item IN Deployment
  ${filter}
  LIMIT ${start},${limit}
  RETURN {deployment: item}`

  return aqlString
}

export const GET_DEPLOYMENT_BY_PROJECTID_TAG = (projectId, tag) => {
  const aql = `FOR template in Template
    Filter template.projectId == ${projectId}
    let deployment = (FOR d in Deployment
    Filter d.tag=='${tag}' AND d.templateKey == template._key
    return d)

    return deployment[0]`
  return aql
}

export const GET_DEPLOYMENT_FOR_PREPROCESS = (key) => {
  const aql = `let deployment = Document("Deployment",'${key}')
  let template = Document("Template",deployment.templateKey)
  let production = Document("Production",template.productionKey)
  let company = Document("Company",production.companyKey)
  let data = Document("Data",deployment.dataKey)
  return {deployment,template,production,company,data}`
  return aql
}

export const GET_DEPLOYMENT_REVIEW_RESULT = (uuid, group, start, limit) => {
  const aql = `
  let deployment = Document("Deployment","${uuid}")
  for reviewRecord IN ReviewRecord
  let user = (
      let review = Document("Review",deployment.reviewKey)
      return review["${group}"]
  )
  filter ${group === 'reviewGroup' ? 'user[0]' : 'user'} ANY == reviewRecord.useruuid
  AND reviewRecord.reviewKey == deployment.reviewKey
  limit ${start},${limit}
  return reviewRecord`

  return aql
}

export const FIND_DEPLOYMENT_BY_TAG = (templateKey, tag) => {
  const aql = `
  FOR item IN Deployment
  FILTER item.templateKey == '${templateKey}' AND item.tag == '${tag}'
  RETURN {deploymentKey:item._key,name:item.tag}`

  return aql
}
