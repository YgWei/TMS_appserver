export const FIND_TEMPATE = (filter, start, limit) => {
  let filterStr = 'FILTER item.invalid == false '
  if (filter.name) {
    filterStr += `AND item.name == '${filter.name}' `
  }
  if (filter.productionKey) {
    filterStr += `AND item.productionKey == '${filter.productionKey}' `
  }
  const queryStr = `
  FOR item IN Template
  ${filterStr}
      let production = Document("Production",item.productionKey)
      let company = Document("Company",production.companyKey)
  SORT item.createTime DESC
  LIMIT ${start},${limit}
  RETURN {template:item,production,company}
  `
  return queryStr
}

export const GET_TEMPLATE = (_key) => {
  const queryStr = `
  let template = Document("Template/${_key}")
  let production = Document("Production",template.productionKey)
  let company = Document("Company",production.companyKey)
  return {template,production,company}
  `
  return queryStr
}

export const GET_WORKCENTER_BY_TEMPATE = (uuid, start, limit) => {
  const queryStr = `
  FOR rel IN TP_WC_rel
  FILTER rel.templateKey == '${uuid}' && rel.invalid == false
  let wc = Document("WorkCenter",rel.workCenterKey)
  LIMIT ${start},${limit}
  RETURN {wc}
  `
  return queryStr
}
