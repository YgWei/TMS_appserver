export const FIND_WORKCENTER = (start, limit, query = {}) => {
  let filter = 'FILTER item.invalid == false'
  if (query.name) {
    filter += ` AND item.name == '${query.name}' `
  }
  const aql = `
  FOR item IN WorkCenter
  ${filter}
  LIMIT ${start},${limit}
  RETURN item
  `
  return aql
}
