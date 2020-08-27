import request from 'request-promise'
import config from '../../config'

const mogodbHost = `${config.cloudStorage.protocol}://${config.cloudStorage.host}:${config.cloudStorage.port}`
const collection = config.cloudStorage.collection
export const deleteFile = async (uuid) => {
  const option = {
    method: 'DELETE',
    uri: `${mogodbHost}/api/${collection}/file/${uuid}`,
    json: true
  }
  const del = await request(option)
  console.log(del)
}
