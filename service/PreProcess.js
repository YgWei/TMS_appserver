import ProductionServices from './Production'
import Services from './Services'
import { DataNotFoundException } from '../exception'

export default class SyncServices extends Services {
  dataProcess = (data) => {
    delete data._key
    delete data._id
    delete data._rev
    delete data.createTime
    delete data.modifyTime
    delete data.createUser
    delete data.modifyUser

    return data
  }

  /**
     * 依據aql回傳資料
     * @param {*} query aql
     */
  async preProcess(query) {
    const productionServices = new ProductionServices()
    await productionServices.get(query.production)

    let filter = ''
    if (query.version) {
      filter = `FILTER deployment.tag == '${query.version}'`
    }

    const deploymentAql = `FOR template IN Template
                    FILTER template.productionKey == '${query.production}'
                    FILTER template.invalid == false
                    FOR deployment IN Deployment
                        FILTER deployment.templateKey == template._key
                        ${filter}
                        FILTER deployment.invalid == false
                        SORT deployment.createTime DESC
                    RETURN {deployment:deployment,template:template}`

    const resData = await this.query(deploymentAql)
    if (resData.count === 0) {
      throw new DataNotFoundException(`version data not found.`)
    }

    return resData
  }
}
