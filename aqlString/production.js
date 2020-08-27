export const GET_PRODUCTION = (companyKey, start, limit) => {
  const aql = `FOR item IN Production
  FILTER item.companyKey == '${companyKey}' AND item.invalid == false
  LIMIT ${start}, ${limit}
  RETURN item
  `
  return aql
}

export const GET_PRODUCTION_BY_NAME = (companyKey, name, start, limit) => {
  const aql = `FOR item IN Production
  FILTER item.companyKey == '${companyKey}' AND item.invalid == false AND item.name = '${name}'
  LIMIT ${start}, ${limit}
  RETURN item
  `
  return aql
}
