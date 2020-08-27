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

describe('Release Controller', () => {
  let app

  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await recover(['Deployment'])
    await app.close()
  })

  it(`#GET, /api/release:\n\t API basic check.`, async function () {
    const home = await supertest(app).get(`/api/release`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10
    })
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.count).to.deep.equal(1)
  })

  it(`#GET, /api/release/108129:\n\t Read test.`, async function () {
    const home = await supertest(app).get(`/api/release/108129`).set('Authorization', `bearer ${adminJWT}`)
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.uuid).to.equal('108129')
    expect(home.body.data.company).to.equal('陽光')
    expect(home.body.data.production).to.equal('陽光個險')
    expect(home.body.data.template).to.equal('模板管理服務')
    expect(home.body.data.deployment).to.equal('dev-0.4')
    expect(home.body.data.data).to.equal('20200323')
  })

  it(`#GET, /api/release/tree:\n\t Read tree(root) test.`, async function () {
    const home = await supertest(app).get(`/api/release/tree`).set('Authorization', `bearer ${adminJWT}`)
      .query({ select: 'root' })
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.results[0].uuid).to.deep.equal('60634')
    expect(home.body.data.results[0].companyUuid).to.deep.equal('60634')
    expect(home.body.data.results[0].name).to.deep.equal('陽光')
    expect(home.body.data.results[0].type).to.deep.equal('company')
  })

  it(`#GET, /api/release/tree:\n\t Read tree(company) test.`, async function () {
    const home = await supertest(app).get(`/api/release/tree`).set('Authorization', `bearer ${adminJWT}`)
      .query({ select: 'company', companyUuid: '60634' })
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.results[0].uuid).to.equal('68014')
    expect(home.body.data.results[0].companyUuid).to.equal('60634')
    expect(home.body.data.results[0].name).to.equal('陽光個險')
    expect(home.body.data.results[0].productionUuid).to.equal('68014')
    expect(home.body.data.results[0].type).to.equal('production')
  })

  it(`#GET, /api/release/tree:\n\t Read tree(production) test.`, async function () {
    const home = await supertest(app).get(`/api/release/tree`).set('Authorization', `bearer ${adminJWT}`)
      .query({ select: 'production', companyUuid: '60634', productionUuid: '68014' })
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.results[0].uuid).to.deep.equal('21792696')
    expect(home.body.data.results[0].name).to.deep.equal('模板管理服務')
    expect(home.body.data.results[0].companyUuid).to.deep.equal('60634')
    expect(home.body.data.results[0].productionUuid).to.deep.equal('68014')
    expect(home.body.data.results[0].templateUuid).to.deep.equal('21792696')
    expect(home.body.data.results[0].type).to.deep.equal('template')
  })

  it(`#GET, /api/release/tree:\n\t Read tree(template) test.`, async function () {
    const home = await supertest(app).get(`/api/release/tree`).set('Authorization', `bearer ${adminJWT}`)
      .query({
        select: 'template',
        companyUuid: '60634',
        productionUuid: '68014',
        templateUuid: '21792696'
      })
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.results[0].uuid).to.deep.equal('108129')
    expect(home.body.data.results[0].name).to.deep.equal('dev-0.4')
    expect(home.body.data.results[0].companyUuid).to.deep.equal('60634')
    expect(home.body.data.results[0].productionUuid).to.deep.equal('68014')
    expect(home.body.data.results[0].templateUuid).to.deep.equal('21792696')
    expect(home.body.data.results[0].deploymentUuid).to.deep.equal('108129')
    expect(home.body.data.results[0].type).to.deep.equal('deployment')
  })

  describe('Create new Release', () => {
    step(`#POST, /api/release:\n\t Create test.`, async function () {
      const res = await supertest(app).post(`/api/release`).set('Authorization', `bearer ${adminJWT}`).send({
        deploymentUuid: '108128'
      })
      expect(res.status).to.deep.equal(200)
      expect(res.body.data.templateKey).to.equal('21792696')
      expect(res.body.data.dataKey).to.equal('107494')
      expect(res.body.data.status).to.deep.equal(['init', 'deploy', 'deploy_success', 'review', 'review_accept', 'release'])
    })

    step(`#GET, /api/release:\n\t API Create check.`, async function () {
      const home = await supertest(app).get(`/api/release`).set('Authorization', `bearer ${adminJWT}`).query({
        start: 0, limit: 10
      })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.count).to.deep.equal(2)
      expect(home.body.data.data[0]).to.have.all.keys([
        'uuid',
        'name'
      ])
    })
  })
})
