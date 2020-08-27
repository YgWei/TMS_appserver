export const FIND_DATA = (name, productionKey, start, limit) => {
  let filter = 'FILTER item.invalid == false'
  if (name) {
    filter += ` AND item.name == '${name}'`
  }
  if (productionKey) {
    filter += ` AND item.productionKey == '${productionKey}'`
  }

  const aqlStr = `
  FOR item IN Data
  ${filter}
  let production = Document("Production",item.productionKey)
  let company = Document("Company",production.companyKey)
  SORT item.createTime DESC
  LIMIT ${start},${limit}
  RETURN { data:item, production, company }
  `

  return aqlStr
}
