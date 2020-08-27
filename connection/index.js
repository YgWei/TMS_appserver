import { Database } from 'arangojs'
import logger from '../logger'
import config from '../config'

let connection
const defaultDB = async () => {
  const { protocal, host, port, username, password, database } = config.db
  const url = `${protocal}://${host}:${port}`
  connection = new Database(url)
  connection.useBasicAuth(username, password)
  connection.useDatabase(database)
  const version = await connection.version()
  const info = { protocal, host, port, database, version }

  logger.info(`Database INFO:`, info)
}
defaultDB()
export default connection
