import chai from 'chai'
import chaiUUID from 'chai-uuid'
import { describe, before, it, after } from 'mocha'
import supertest from 'supertest'
import createServer from '../../index'
import { adminJWT } from './Login.spec'
import { recover } from '../init/connection'
import { step } from 'mocha-steps'

const { expect } = chai
chai.use(chaiUUID)
describe('Template Controller', () => {
  let app
  // const arangoServices = new ArangoServices()
  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await recover(['Template', 'TP_WC_rel'])
    await app.close()
  })

  it('# GET, /api/template', async function () {
    const res = await supertest(app)
      .get('/api/template')
      .query({ start: 0, limit: 10, type: 'all' })
      .set('Authorization', `bearer ${adminJWT}`)
    expect(res.body.status).to.deep.equal('success')
    expect(res.body.data.count).to.equal(1)
    expect(res.body.data.data[0]).to.have.keys(['uuid', 'name', 'company', 'production', 'repository', 'type', 'entryPoint', 'description', 'invalid'])
  })

  it('# GET, /api/template/{uuid}', async function () {
    const res = await supertest(app)
      .get('/api/template/21792696')
      .set('Authorization', `bearer ${adminJWT}`)
    const body = res.body
    expect(body.status).to.equal('success')
    expect(body.data.uuid).to.equal('21792696')
    expect(body.data.name).to.equal('模板管理服務')
    expect(body.data.company).to.deep.equal('陽光')
    expect(body.data.production).to.deep.equal('陽光個險')
    expect(body.data.repository).to.deep.equal('TMS_dev')
  })

  it('# GET, /api/template/21792696/workcenter', async function () {
    const res = await supertest(app)
      .get('/api/template/21792696/workcenter')
      .set('Authorization', `bearer ${adminJWT}`).query({
        start: 0,
        limit: 10,
        type: 'select'
      })
    const body = res.body
    expect(body.status).to.deep.equal('success')
    expect(body.data.count).to.equal(1)
    expect(body.data.data[0]).to.have.keys('uuid', 'name')
  })

  describe('Create template data', () => {
    step('# POST, /api/template 需要登入gitlab 暫時無法測試')
    step('# GET, /api/template/')
    step('# GET, /api/template/{uuid}')
  })

  describe('Update template data', () => {
    let updateTemplateKey = ''
    step('# PUT, /api/template/21792696', async function () {
      const res = await supertest(app)
        .put('/api/template/21792696')
        .send({
          name: 'string',
          type: 'fop',
          entryPoint: 'string',
          description: 'string',
          workCenters: ['21789428']
        })
        .set('Authorization', `bearer ${adminJWT}`)
      const body = res.body

      expect(body.message).to.equal('success.')
      expect(body.status).to.equal('success')
      expect(body.data.name).to.equal('string')
      expect(body.data.type).to.equal('fop')
      expect(body.data.entryPoint).to.equal('string')
      expect(body.data.description).to.equal('string')

      updateTemplateKey = body.data.uuid
    })
    step('# GET, /api/template/{updateTemplateKey}', async () => {
      const res = await supertest(app)
        .get(`/api/template/${updateTemplateKey}`)
        .set('Authorization', `bearer ${adminJWT}`)
      const body = res.body
      expect(body.status).to.equal('success')
      expect(body.data.uuid).to.equal(updateTemplateKey)
      expect(body.data.name).to.equal('string')
      expect(body.data.company).to.deep.equal('陽光')
      expect(body.data.production).to.deep.equal('陽光個險')
      expect(body.data.repository).to.deep.equal('TMS_dev')
    })
  })
  describe('Invalid template data', () => {
    step('# Delete, /api/template/21792696', async function () {
      const res = await supertest(app)
        .delete('/api/template/21792696')
        .set('Authorization', `bearer ${adminJWT}`)
      const body = res.body
      expect(body.status).to.deep.equal('success')
    })
    step('# GET, /api/template/{uuid}', async function () {
      const res = await supertest(app)
        .get('/api/template/21792696')
        .set('Authorization', `bearer ${adminJWT}`)
      const body = res.body
      expect(body.status).to.equal('success')
    })
  })
})
