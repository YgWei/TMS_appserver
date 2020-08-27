export const GET_WORKCENTER_BY_TEMPLATEKEY = (_key) => {
  const aql = `FOR item IN TP_WC_rel
  FILTER item.invalid == false
  FILTER item.templateKey == '${_key}'
  RETURN item
  `
  return aql
}

export const GET_TP_WC_REL_KEY = (templateKey, workCenterKey) => {
  const aqlString = `FOR item IN TP_WC_rel
  FILTER item.invalid == false
  FILTER item.templateKey == '${templateKey}'
  FILTER item.workCenterKey == '${workCenterKey}'
  return item`

  return aqlString
}
