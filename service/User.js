// import Services from './Services'
// import uuidV4 from 'uuid/v4'
import Authorization from '../util/Authorization'

const formatter = {
  select: (data) => ({
    uuid: data.uuid,
    name: data.name
  }),
  default: (data) => ({
    ...data
  })
}

// const createUser = (data, user) => ({
//   uuid: uuidV4(),
//   createTime: new Date(),
//   modifyTime: new Date(),
//   createUser: user || 'admin',
//   modifyUser: user || 'admin'
// })

export default class UserServices {
  async findUser(query) {
    const authorization = new Authorization()
    await authorization.adminLogin()
    const res = await authorization.findUser(query)
    res.data = res.data.map((item) => {
      return formatter[query.type || 'default'](item)
    })
    return res
  }

  async getUser(uuid) {
    const authorization = new Authorization()
    const res = await authorization.getUser(uuid)

    return formatter['select'](res)
  }
}
