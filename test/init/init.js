const { init } = require('./util')
const { connection } = require('./connection')

export const beforeTest = async () => {
  const db = await connection()
  await init(db)
}

beforeTest()
