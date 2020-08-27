export const FIND_PRODUCT_OWNER = (start, limit) => {
  const aql = `
  FOR item IN ProductOwner
  FILTER item.invalid == false
  let rel = Document("TP_WC_rel",item.TP_WC_relKey)
  let template = Document("Template",rel.templateKey)
  let production = Document("Production",template.templateKey)
  LIMIT ${start},${limit}
  RETURN {productOwner:item,rel,template,production}
  `
  return aql
}

export const GET_PRODUCT_OWNER_BY_TPWCRELKEY = (tpwcrelKey) => {
  const aql = `
  FOR item IN ProductOwner
  FILTER item.tpwcrelKey == '${tpwcrelKey}' AND item.invalid == false
  RETURN item
  `
  return aql
}
