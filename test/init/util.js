import fs from 'fs-extra'

export const loadData = async () => {
  const files = await fs.readdir('test/data')
  const dataObject = {}
  for (const file of files) {
    const collectionName = file.replace('-TMS.json', '')
    dataObject[collectionName] = await require(`../data/${file}`)
  }
  return dataObject
}

export const init = async (db) => {
  if (!db) {
    throw new Error('db can not empty')
  }
  let initData
  try {
    initData = await loadData()
  } catch (err) {
    console.log(err)
  }

  let collection = {}

  for (const key of Object.keys(initData)) {
    console.log(`Data import : creating ${key}.`)
    collection = db.collection(key)
    await collection.truncate()
    if (initData[key] !== '') {
      const res = await collection.import(initData[key])
      if (!res.error) {
        console.log(`Data import : ${key} created ${res.created}.`)
      } else {
        console.log(res)
      }
    }
  }
}

export const recovery = async (db, recoveryArray = []) => {
  if (!db) {
    throw new Error('db can not empty')
  }
  const initData = await loadData()

  let collection = {}

  for (const key of recoveryArray) {
    collection = db.collection(key)
    await collection.truncate()
    if (initData[key] !== '') {
      const res = await collection.import(initData[key])
      if (!res.error) {
        console.log(`Data recovery : ${key} created ${res.created}.`)
      } else {
        console.log(res)
      }
    }
  }
}
