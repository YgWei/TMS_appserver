import chai from 'chai'
import chaiUUID from 'chai-uuid'
import { describe, it, before, after } from 'mocha'
import supertest from 'supertest'
import createServer from '../../index'
import { adminJWT } from './Login.spec'
import { recover } from '../init/connection'
import { step } from 'mocha-steps'

const { expect } = chai
chai.use(chaiUUID)

describe('Client Controller', () => {
  let app

  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await recover(['UpdateRecord'])
    await app.close()
  })

  it(`# GET, /api/client/workcenter/21789428/updateRecord`, async function () {
    const home = await supertest(app).get(`/api/client/workcenter/21789428/updateRecord`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10
    })
    expect(home.status).to.equal(200)
    expect(home.body.data.count).to.equal(1)
    expect(home.body.data.data[0]).to.have.all.keys(['updateRecord', 'deployment', 'company', 'production', 'template'])
    expect(home.body.data.data[0].updateRecord._key).to.equal('70000003')
    expect(home.body.data.data[0].deployment._key).to.equal('55402')
    expect(home.body.data.data[0].company._key).to.equal('60634')
    expect(home.body.data.data[0].production._key).to.equal('68014')
    expect(home.body.data.data[0].template._key).to.equal('21792696')
  })

  it(`# GET, /api/client/workcenter/21789428/template`, async function () {
    const home = await supertest(app).get(`/api/client/workcenter/21789428/template`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10
    })
    expect(home.status).to.equal(200)
    expect(home.body.data.count).to.equal(1)
    expect(home.body.data.data[0]).to.have.all.keys(['updateRecords', 'company', 'production', 'template'])
    expect(home.body.data.data[0].updateRecords[0]._key).to.equal('70000003')
    expect(home.body.data.data[0].company._key).to.equal('60634')
    expect(home.body.data.data[0].production._key).to.equal('68014')
    expect(home.body.data.data[0].template._key).to.equal('21792696')
  })

  it(`# GET, /api/client/workcenter/21789428/template/21792696/updateRecord`, async function () {
    const home = await supertest(app).get(`/api/client/workcenter/21789428/template/21792696/updateRecord`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10
    })
    expect(home.status).to.equal(200)
    expect(home.body.data.count).to.equal(1)
    expect(home.body.data.data[0]).to.have.all.keys(['updateRecord', 'deployment', 'data'])
    expect(home.body.data.data[0].updateRecord._key).to.equal('70000003')
    expect(home.body.data.data[0].deployment._key).to.equal('55402')
    expect(home.body.data.data[0].data._key).to.equal('107494')
  })

  it(`# GET, /api/client/workcenter/21789428/template/21792696/updateRecord`, async function () {
    const home = await supertest(app).get(`/api/client/workcenter/21789428/template/21792696/updateRecord`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10
    })
    expect(home.status).to.equal(200)
    expect(home.body.data.count).to.equal(1)
    expect(home.body.data.data[0]).to.have.all.keys(['updateRecord', 'deployment', 'data'])
    expect(home.body.data.data[0].updateRecord._key).to.equal('70000003')
    expect(home.body.data.data[0].deployment._key).to.equal('55402')
    expect(home.body.data.data[0].data._key).to.equal('107494')
  })

  it(`# GET, /api/client/updateRecord/70000003`, async function () {
    const home = await supertest(app).get(`/api/client/updateRecord/70000003`).set('Authorization', `bearer ${adminJWT}`)
    expect(home.status).to.equal(200)
    expect(home.body.data._key).to.equal('70000003')
    expect(home.body.data.status.length).to.equal(1)
    expect(home.body.data.status[0]).to.equal('init')
    expect(home.body.data.deployment._key).to.equal('55402')
  })

  describe('Pull status into updateRecord.', () => {
    step(`# POST, /api/client/updateRecord/70000003/updateStatus`, async function () {
      const home = await supertest(app).post(`/api/client/updateRecord/70000003/updateStatus`)
        .set('Authorization', `bearer ${adminJWT}`).send({ status: 'update' })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.status.length).to.equal(2)
      expect(home.body.data.status[0]).to.equal('init')
      expect(home.body.data.status[1]).to.equal('update')
    })
    step(`# POST, /api/client/updateRecord/70000003/updateStatus`, async function () {
      const home = await supertest(app).post(`/api/client/updateRecord/70000003/updateStatus`)
        .set('Authorization', `bearer ${adminJWT}`).send({ status: 'update_fail' })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.status.length).to.equal(3)
      expect(home.body.data.status[0]).to.equal('init')
      expect(home.body.data.status[1]).to.equal('update')
      expect(home.body.data.status[2]).to.equal('update_fail')
    })
    step(`# POST, /api/client/updateRecord/70000003/updateStatus`, async function () {
      const home = await supertest(app).post(`/api/client/updateRecord/70000003/updateStatus`)
        .set('Authorization', `bearer ${adminJWT}`).send({ status: 'update_success' })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.status.length).to.equal(4)
      expect(home.body.data.status[0]).to.equal('init')
      expect(home.body.data.status[1]).to.equal('update')
      expect(home.body.data.status[2]).to.equal('update_fail')
      expect(home.body.data.status[3]).to.equal('update_success')
    })
    step(`# POST, /api/client/updateRecord/70000003/updateStatus`, async function () {
      const home = await supertest(app).post(`/api/client/updateRecord/70000003/updateStatus`)
        .set('Authorization', `bearer ${adminJWT}`).send({ status: 'reported' })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.status.length).to.equal(5)
      expect(home.body.data.status[0]).to.equal('init')
      expect(home.body.data.status[1]).to.equal('update')
      expect(home.body.data.status[2]).to.equal('update_fail')
      expect(home.body.data.status[3]).to.equal('update_success')
      expect(home.body.data.status[4]).to.equal('reported')
    })
  })
})
