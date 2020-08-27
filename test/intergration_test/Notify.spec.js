import chai from 'chai'
import chaiUUID from 'chai-uuid'
import { describe, it, before, after } from 'mocha'
import supertest from 'supertest'
import createServer from '../../index'
import { adminJWT } from './Login.spec'
import { recover } from '../init/connection'

const { expect } = chai
chai.use(chaiUUID)

describe('Notify Controller:', () => {
  let app

  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await recover(['Notify', 'ReviewRecord'])
    await app.close()
  })

  it(`#GET, /api/notify:\n\t Find test.`, async function () {
    const home = await supertest(app).get(`/api/notify`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10, type: 'review'
    })
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.count).to.equal(1)
    expect(home.body.data.data[0]).to.have.all.keys(['uuid', 'company', 'production', 'template', 'templateVersion', 'cloudStorageUuid', 'endTime'])
  })

  it(`#GET, /api/notify/138720:\n\t Read test.`, async function () {
    const home = await supertest(app).get(`/api/notify/138720`).set('Authorization', `bearer ${adminJWT}`)
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.uuid).to.deep.equal('138720')
    expect(home.body.data.company).to.deep.equal('陽光')
    expect(home.body.data.production).to.deep.equal('陽光個險')
    expect(home.body.data.template).to.deep.equal('模板管理服務')
    expect(home.body.data.version).to.deep.equal('dev-0.2.5')
    expect(home.body.data.startTime).to.deep.equal('2020-03-31T22:00:00.000Z')
    expect(home.body.data.endTime).to.deep.equal('2022-04-30T10:00:00.000Z')
    expect(home.body.data.reviewState).to.deep.equal('accept')
    expect(home.body.data.reviewMessage).to.deep.equal('message')
  })

  it(`#GET, /api/notify/personal:\n\t Read test.`, async function () {
    const home = await supertest(app).get(`/api/notify/personal`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10, type: 'review'
    })
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.data[0].uuid).to.deep.equal('138720')
    expect(home.body.data.data[0].company).to.deep.equal('陽光')
    expect(home.body.data.data[0].production).to.deep.equal('陽光個險')
    expect(home.body.data.data[0].template).to.deep.equal('模板管理服務')
    expect(home.body.data.data[0].templateVersion).to.deep.equal('dev-0.2.5')
    expect(home.body.data.data[0].startTime).to.deep.equal('2020-03-31T22:00:00.000Z')
    expect(home.body.data.data[0].endTime).to.deep.equal('2022-04-30T10:00:00.000Z')
    expect(home.body.data.data[0].reviewState).to.deep.equal('accept')
    expect(home.body.data.data[0].reviewMessage).to.deep.equal('message')
  })

  it(`#PUT, /api/notify/138720/submit/review:\n\t submit notify(review) test.`, async function () {
    const home = await supertest(app).put(`/api/notify/138720/submit/review`).set('Authorization', `bearer ${adminJWT}`).send({
      result: 'string',
      message: 'string'
    })
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.result).to.equal('string')
    expect(home.body.data.message).to.equal('string')
  })
})
