/* eslint-disable no-unused-expressions */
import chai from 'chai'
import chaiUUID from 'chai-uuid'
import { describe, it, before, after } from 'mocha'
import supertest from 'supertest'
import createServer from '../../index'

const { expect } = chai
chai.use(chaiUUID)
export let adminJWT = ''
describe('Login Controller', () => {
  let app
  // const arangoServices = new ArangoServices()
  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await app.close()
  })
  it('# POST, /api/login/system', async function () {
    const res = await supertest(app).post('/api/login/system').send({
      account: 'admin',
      password: 'admin'
    })
    adminJWT = res.body.data.jwt
    expect(adminJWT).to.not.be.null
  })
})
