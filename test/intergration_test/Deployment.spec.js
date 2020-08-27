import chai from 'chai'
import chaiUUID from 'chai-uuid'
import { describe, it, before, after } from 'mocha'
import supertest from 'supertest'
import createServer from '../../index'
import { adminJWT } from './Login.spec'
import { step } from 'mocha-steps'
import { recover } from '../init/connection'

const { expect } = chai
chai.use(chaiUUID)

describe('Deployment Controller', () => {
  let app
  // const arangoServices = new ArangoServices()
  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await recover(['Deployment', 'Review', 'Notify', 'ReviewRecord'])
    await app.close()
  })
  it('# GET, /api/deployment', async function () {
    const res = await supertest(app).get('/api/deployment').set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10, type: 'all'
    })
    const body = res.body
    expect(body.status).to.equal('success')
    expect(body.data.count).to.equal(5)
    expect(body.data.data[0]).to.have.all.keys('uuid', 'name', 'company', 'production', 'template', 'data', 'state', 'note', 'createTime')
  })
  it('# GET, /api/deployment/55402', async function () {
    const res = await supertest(app).get('/api/deployment/55402').set('Authorization', `bearer ${adminJWT}`)
    const body = res.body
    expect(body.status).to.equal('success')
    expect(body.data.deployment.uuid).to.equal('55402')
    expect(body.data.deployment.company).to.deep.equal({
      uuid: '60634',
      name: '陽光'
    })
    expect(body.data.deployment.production).to.deep.equal({
      uuid: '68014',
      name: '陽光個險'
    })
    expect(body.data.deployment.template).to.deep.equal({
      uuid: '21792696',
      branch: 'sp1',
      commit: '5061367136ae959b25b7896c920857b36161bf1a',
      tag: 'dev-0.1',
      name: '模板管理服務',
      repository: 'TMS_dev'
    })
    expect(body.data.deployment.data).to.deep.equal({
      uuid: '107494',
      name: '20200323',
      cloudStorageUuid: '5e78468115475e0017bb2efa'
    })
    expect(body.data.deployment.state).to.equal('init')
    expect(body.data.deployment.note).to.equal('string')
    expect(body.data.review).to.deep.equal({})
  })

  describe('Create new Deployment', () => {
    step('# POST, /api/deployment 有gitlab相關功能先pending')
  })

  describe('Update new Deployment', () => {
    step('# PUT, /api/deployment/55402', async function () {
      const res = await supertest(app).put('/api/deployment/55402').set('Authorization', `bearer ${adminJWT}`).send({
        note: 'new note'
      })
      expect(res.body.data.note).to.equal('new note')
    })
    step('# GET, /api/deployment/55402', async function () {
      const res = await supertest(app).get('/api/deployment/55402').set('Authorization', `bearer ${adminJWT}`)
      expect(res.body.data.deployment.note).to.equal('new note')
    })
  })

  // describe('Start deploy', () => {
  //   step('# POST, /api/deployment/55402/deploy', async function () {
  //     const res = await supertest(app).post('/api/deployment/55402/deploy').set('Authorization', `bearer ${adminJWT}`)
  //     expect(res.body.status).to.equal('success')
  //   })
  //   step('# GET, /api/deployment/55402', async function () {
  //     const res = await supertest(app).get('/api/deployment/55402').set('Authorization', `bearer ${adminJWT}`)
  //     expect(res.body.data.deployment.state).to.equal('deploy_success')
  //   })
  // })

  describe('Start review', () => {
    step('# POST, /api/deployment/108127/review', async function () {
      const res = await supertest(app).post('/api/deployment/55402/review').set('Authorization', `bearer ${adminJWT}`).send(
        {
          reviewUser: 'aa2230fe-f004-441d-bc77-48569d590eb9',
          customer: 'aa2230fe-f004-441d-bc77-48569d590eb9',
          reviewGroup: [
            'aa2230fe-f004-441d-bc77-48569d590eb9'
          ],
          startTime: '2020-01-01T00:00:00.000Z',
          endTime: '2020-01-01T00:00:00.000Z'
        }
      )
      expect(res.body.status).to.equal('success')
    })
    step('# GET, /api/deployment/108127', async function () {
      const res = await supertest(app).get('/api/deployment/55402').set('Authorization', `bearer ${adminJWT}`)
      expect(res.body.data.deployment.state).to.equal('review')
    })
  })

  describe('Accept review', () => {
    step('# POST, /api/deployment/108127/review/submit 未開發')
    step('# GET, /api/deployment/108127 未開發')
  })

  describe('Reject review', () => {
    step('# POST, /api/deployment/108127/review/submit 未開發')
    step('# GET, /api/deployment/108127 未開發')
  })
})
