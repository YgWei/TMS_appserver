export const FIND_NOTIFY = (start, limit) => {
  const aql = `FOR item IN Notify
  FILTER item.type == 'review' AND item.invalid == false
  let review = Document("Review",item.reviewKey)
  let reviewRecord = Document("ReviewRecord",item.reviewRecordKey)
  let deployment = Document("Deployment",review.deploymentKey)
  let template = Document("Template",deployment.templateKey)
  let production = Document("Production",template.productionKey)
  let company = Document("Company",production.companyKey)
  LIMIT ${start}, ${limit}
  RETURN {notify:item, review, reviewRecord, deployment, template, production, company }`
  return aql
}

export const FIND_PERSONAL_REVIEW_NOTIFY = (useruuid, type, start, limit) => {
  const now = new Date().toISOString()
  const aql = `FOR item IN Notify
  FILTER item.type == '${type}' AND item.to == '${useruuid}' AND '${now}' < item.endTime
  let review = Document("Review",item.reviewKey)
  let reviewRecord = Document("ReviewRecord",item.reviewRecordKey)
  let deployment = Document("Deployment",review.deploymentKey)
  let template = Document("Template",deployment.templateKey)
  let production = Document("Production",template.productionKey)
  let company = Document("Company",production.companyKey)
  SORT item.createTime DESC
  LIMIT ${start}, ${limit}
  RETURN {notify:item, review, reviewRecord, deployment, template, production, company }`
  return aql
}

export const GET_NOTIFY_BY_UUID = (uuid) => {
  const aql = `
  FOR item IN Notify
  filter item._key == '${uuid}'
  let review = Document("Review",item.reviewKey)
  let reviewRecord = Document("ReviewRecord",item.reviewRecordKey)
  let deployment = Document("Deployment",review.deploymentKey)
  let template = Document("Template",deployment.templateKey)
  let production = Document("Production",template.productionKey)
  let company = Document("Company",production.companyKey)
  RETURN {notify:item, review, reviewRecord, deployment, template, production, company }`
  return aql
}
