import chai from 'chai'
import chaiUUID from 'chai-uuid'
import { describe, before, after } from 'mocha'
import supertest from 'supertest'
import createServer from '../../index'
import { adminJWT } from './Login.spec'
import { recover } from '../init/connection'
import { step } from 'mocha-steps'

const { expect } = chai
chai.use(chaiUUID)

describe('WorkCenter Controller', () => {
  let app

  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await recover(['WorkCenter', 'TP_WC_rel'])
    await app.close()
  })

  step(`#GET, /api/workcenter:\n\t Find test.`, async function () {
    const home = await supertest(app).get(`/api/workcenter`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10, type: 'all'
    })
    expect(home.status).to.equal(200)
    expect(home.body.data.count).to.equal(1)
    expect(home.body.data.data[0]).to.have.all.keys(['uuid', 'name', 'region'])
  })

  step(`#GET, /api/workcenter/21789428:\n\t Read test.`, async function () {
    const home = await supertest(app).get(`/api/workcenter/21789428`).set('Authorization', `bearer ${adminJWT}`)
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.uuid).to.deep.equal('21789428')
    expect(home.body.data.name).to.deep.equal('北京')
    expect(home.body.data.region).to.deep.equal('北京')
  })

  describe('Create a new Workcenter', () => {
    let tempWorkCenterUUid
    step(`#POST, /api/workcenter:\n\t Create test.`, async function () {
      const home = await supertest(app).post(`/api/workcenter`).set('Authorization', `bearer ${adminJWT}`).send({
        name: 'string',
        region: 'string'
      })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.name).to.deep.equal('string')
      expect(home.body.data.region).to.deep.equal('string')
      tempWorkCenterUUid = home.body.data.uuid
    })

    step(`#GET, /api/workcenter:\n\t Create check.`, async function () {
      const home = await supertest(app).get(`/api/workcenter/${tempWorkCenterUUid}`).set('Authorization', `bearer ${adminJWT}`)
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.name).to.deep.equal('string')
      expect(home.body.data.region).to.deep.equal('string')
    })
  })

  describe('Update WorkCenter', () => {
    step(`#PUT, /api/workcenter/{uuid}:\n\t Update test.`, async function () {
      const home = await supertest(app).put(`/api/workcenter/21789428`).set('Authorization', `bearer ${adminJWT}`).send({
        name: 'string',
        region: 'string'
      })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.uuid).to.deep.equal('21789428')
      expect(home.body.data.name).to.deep.equal('string')
      expect(home.body.data.region).to.deep.equal('string')
    })

    step(`#GET, /api/workcenter/{uuid}:\n\t Update check.`, async function () {
      const home = await supertest(app).get(`/api/workcenter/21789428`).set('Authorization', `bearer ${adminJWT}`)
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.uuid).to.deep.equal('21789428')
      expect(home.body.data.name).to.deep.equal('string')
      expect(home.body.data.region).to.deep.equal('string')
    })
  })

  describe('WorkCenter with Template', () => {
    step(`#POST, /api/workcenter/21789428/template:\n\t Create template relation test.`, async function () {
      const home = await supertest(app).post(`/api/workcenter/21789428/template`).set('Authorization', `bearer ${adminJWT}`)
        .send({ templateUuid: '21792696' })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.workCenterUuid).to.deep.equal('21789428')
      expect(home.body.data.templateUuid).to.deep.equal('21792696')
    })
    step(`#GET, /api/workcenter/21789428/template:\n\t Get template relation test.`, async function () {
      const home = await supertest(app).get(`/api/workcenter/21789428/template`).set('Authorization', `bearer ${adminJWT}`).query({
        start: 0, limit: 10, type: 'list'
      })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.count).to.deep.equal(2)
      expect(home.body.data.data[0]).to.have.all.keys(['company',
        'companyUuid',
        'production',
        'productionUuid',
        'template',
        'templateUuid'])
    })

    step(`#DELETE, /api/workcenter/{workcenterUuid}/template/{templateUuid}:\n\t Delete template relation test.`, async function () {
      const home = await supertest(app).delete(`/api/workcenter/21789428/template/21792696`).set('Authorization', `bearer ${adminJWT}`)
      expect(home.status).to.deep.equal(200)
    })

    step(`#GET, /api/workcenter/21789428/template:\n\t Delete template relation check.`, async function () {
      const home = await supertest(app).get(`/api/workcenter/21789428/template`).set('Authorization', `bearer ${adminJWT}`).query({
        start: 0, limit: 10, type: 'list'
      })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.count).to.deep.equal(1)
    })
  })

  describe('workcenter with ProductOwner', () => {
    let tempProductOwnerUuid
    step(`#POST, /api/workcenter/21789428/productOwner:\n\t Create ProductOwner test.`, async function () {
      const home = await supertest(app).post(`/api/workcenter/21789428/productOwner`).set('Authorization', `bearer ${adminJWT}`)
        .send({
          templateUuid: '21792696',
          name: 'name',
          email: 'email',
          phone: 'phone'
        })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.workCenterUuid).to.deep.equal('21789428')
      expect(home.body.data.templateUuid).to.deep.equal('21792696')
      expect(home.body.data.name).to.deep.equal('name')
      expect(home.body.data.email).to.deep.equal('email')
      expect(home.body.data.phone).to.deep.equal('phone')
      tempProductOwnerUuid = home.body.data.uuid
    })

    step(`#GET, /api/workcenter/21789428/productOwner:\n\t Get ProductOwner test.`, async function () {
      const home = await supertest(app).get(`/api/workcenter/21789428/productOwner`).set('Authorization', `bearer ${adminJWT}`).query({
        start: 0, limit: 10
      })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.count).to.deep.equal(1)
      expect(home.body.data.data[0].workCenterUuid).to.deep.equal('21789428')
      expect(home.body.data.data[0].templateUuid).to.deep.equal('21792696')
      expect(home.body.data.data[0].name).to.deep.equal('name')
      expect(home.body.data.data[0].email).to.deep.equal('email')
      expect(home.body.data.data[0].phone).to.deep.equal('phone')
      expect(home.body.data.data[0].uuid).to.deep.equal(tempProductOwnerUuid)
      expect(home.body.data.data[0].templateName).to.deep.equal('模板管理服務')
    })

    step(`#PUT, /api/workcenter/{workcenteruuid}/productOwner/{uuid}:\n\t Update test.`, async function () {
      const home = await supertest(app).put(`/api/workcenter/21789428/productOwner/${tempProductOwnerUuid}`).set('Authorization', `bearer ${adminJWT}`)
        .send({
          templateUuid: '21792696',
          name: 'name1',
          email: 'email1',
          phone: 'phone1'
        })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.uuid).to.deep.equal(tempProductOwnerUuid)
      expect(home.body.data.name).to.deep.equal('name1')
      expect(home.body.data.email).to.deep.equal('email1')
      expect(home.body.data.phone).to.deep.equal('phone1')
    })

    step(`#DELETE, /api/workcenter/21789428/productOwner/{uuid}:\n\t Delete ProductOwner test.`, async function () {
      const homeToDelete = await supertest(app).delete(`/api/workcenter/21789428/productOwner/${tempProductOwnerUuid}`).set('Authorization', `bearer ${adminJWT}`)
      expect(homeToDelete.status).to.deep.equal(200)
    })

    step(`#GET, /api/workcenter/21789428/productOwner:\n\t Delete check.`, async function () {
      const home = await supertest(app).get(`/api/workcenter/21789428/productOwner`).set('Authorization', `bearer ${adminJWT}`).query({
        start: 0, limit: 10
      })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.count).to.deep.equal(0)
    })
  })

  step(`#GET, /api/workcenter/21789428/updateRecord:\n\t Get updateRecord check.`, async function () {
    const home = await supertest(app).get(`/api/workcenter/21789428/updateRecord`).set('Authorization', `bearer ${adminJWT}`)
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.count).to.deep.equal(1)
    expect(home.body.data.data[0].uuid).to.deep.equal('70000003')
    expect(home.body.data.data[0].tpwcRelUuid).to.deep.equal('39312')
    expect(home.body.data.data[0].releaseUuid).to.deep.equal('55402')
    expect(home.body.data.data[0].startTime).to.deep.equal('2020-04-05T22:00:00.000Z')
    expect(home.body.data.data[0].templateName).to.deep.equal('模板管理服務')
    expect(home.body.data.data[0].releaseVersion).to.deep.equal('dev-0.1')
  })
})
