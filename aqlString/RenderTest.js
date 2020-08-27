export const FIND = (start, limit) => {
  const aql = `FOR item IN RenderTest
  FILTER DATE_TIMESTAMP(item.expiryTime) > DATE_NOW()
  let deployment = Document('Deployment',item.deploymentKey)
  let template = Document('Template',deployment.templateKey)
  let production = Document('Production',template.productionKey)
  let company = Document('Company',production.companyKey)
  LIMIT ${start},${limit}
  RETURN {renderTest:item, deployment, template, production, company}
  `
  return aql
}

export const GET = (key) => {
  const aql = `
  let renderTest = Document('RenderTest','${key}')
  let deployment = Document('Deployment',renderTest.deploymentKey)
  let template = Document('Template',deployment.templateKey)
  let production = Document('Production',template.productionKey)
  let company = Document('Company',production.companyKey)
  RETURN {renderTest, deployment, template, production, company}
  `
  return aql
}
