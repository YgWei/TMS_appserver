export const GET_COMPANY = (start, limit) => {
  const aql = `FOR item IN Company
  FILTER item.invalid == false
  LIMIT ${start}, ${limit}
  RETURN item
  `
  return aql
}

export const GET_COMPANY_BY_NAME = (name, start, limit) => {
  const aql = `FOR item IN Company
  FILTER item.invalid == false AND item.name == '${name}'
  LIMIT ${start}, ${limit}
  RETURN item
  `
  return aql
}
