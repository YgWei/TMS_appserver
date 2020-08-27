export const FIND_WORKCENTER_UPDATERECORD = (workCenterKey, start, limit) => {
  const aql = `FOR tpwc IN TP_WC_rel
  FILTER tpwc.workCenterKey == '${workCenterKey}'
  FILTER tpwc.invalid == false
  FOR updateRecord IN UpdateRecord
    FILTER tpwc._key == updateRecord.TP_WC_relKey
    FILTER updateRecord.invalid == false
    let template = (
      FOR template IN Template
        FILTER tpwc.templateKey == template._key
        FILTER template.invalid == false
      RETURN template
    )
    let production = (
      FOR production IN Production
        FILTER template[0].productionKey == production._key
        FILTER production.invalid == false
      RETURN production
    )
    let company = (
      FOR company IN Company
        FILTER production[0].companyKey == company._key
        FILTER company.invalid == false
      RETURN company
    )
    let deployment = (
      FOR deployment IN Deployment
        FILTER updateRecord.deploymentKey == deployment._key
        FILTER deployment.invalid == false
      RETURN deployment
    )
    LIMIT ${start},${limit}
    RETURN {updateRecord:updateRecord, deployment:deployment[0], company:company[0], production:production[0], template:template[0]}`

  return aql
}

export const FIND_WORKCENTER_TEMPLATE = (workCenterKey, start, limit) => {
  const aql = `FOR tpwc IN TP_WC_rel
    FILTER tpwc.workCenterKey == '${workCenterKey}'
    FILTER tpwc.invalid == false
    FOR template IN Template
      FILTER tpwc.templateKey == template._key
      FILTER template.invalid == false
      let updateRecord = (
        FOR updateRecord IN UpdateRecord
          FILTER tpwc._key == updateRecord.TP_WC_relKey
          FILTER updateRecord.invalid == false
        RETURN updateRecord
      )
      let production = (
        FOR production IN Production
          FILTER template.productionKey == production._key
          FILTER production.invalid == false
        RETURN production
      )
      let company = (
        FOR company IN Company
          FILTER production[0].companyKey == company._key
          FILTER company.invalid == false
        RETURN company
      )
      LIMIT ${start},${limit}
      RETURN {template:template, updateRecords:updateRecord, company:company[0], production:production[0]}`

  return aql
}

export const FIND_WORKCENTER_TEMPLATE_UPDATERECORD = (workCenterKey, templateKey, start, limit) => {
  const aql = `FOR tpwc IN TP_WC_rel
    FILTER tpwc.templateKey == '${templateKey}'
    FILTER tpwc.workCenterKey == '${workCenterKey}'
    FILTER tpwc.invalid == false
    FOR updateRecord IN UpdateRecord
      FILTER tpwc._key == updateRecord.TP_WC_relKey
      FILTER updateRecord.invalid == false
      let deployment = (
        FOR deployment IN Deployment
          FILTER updateRecord.deploymentKey == deployment._key
          FILTER deployment.invalid == false
        RETURN deployment
      )
      let data = (
        FOR data IN Data
          FILTER deployment[0].dataKey == data._key
          FILTER data.invalid == false
        RETURN data
      )
      LIMIT ${start},${limit}
      SORT updateRecord.updateTime DESC
      RETURN {updateRecord:updateRecord, deployment:deployment[0], data:data[0]}`
  return aql
}
