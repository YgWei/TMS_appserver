export const FIND_UPDATE_RECORDS = (start, limit) => {
  const queryStr = `
  FOR item IN UpdateRecord
  FILTER item.invalid == false
      let deployment = Document("Deployment", item.deploymentKey)
      let template = Document("Template", deployment.templateKey)
      let tpwcrel = Document("TP_WC_rel", item.TP_WC_relKey)
      let workcenter = Document("WorkCenter", tpwcrel.workCenterKey)
  SORT item.createTime DESC
  LIMIT ${start},${limit}
  RETURN {updateRecord:item, template, deployment, workcenter}
  `
  return queryStr
}
