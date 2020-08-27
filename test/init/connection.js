import { Database } from 'arangojs'
import { recovery } from './util'

export const connection = async () => {
  const { protocal, host, port, username, password, database } =
  { protocal: 'http', host: '192.168.20.62', port: '8530', username: 'root', password: 'belstar123', database: 'TMS_test' }
  const url = `${protocal}://${host}:${port}`
  const db = new Database(url)
  db.useBasicAuth(username, password)
  db.useDatabase(database)
  // const info = { protocal, host, port, database }
  // const version = await db.version()
  // console.log({ ...info, ...version })

  return db
}

export const recover = async (array) => {
  const db = await connection()
  await recovery(db, array)
}
