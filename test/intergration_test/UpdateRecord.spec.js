import chai from 'chai'
import chaiUUID from 'chai-uuid'
import { describe, it, before, after } from 'mocha'
import supertest from 'supertest'
import createServer from '../../index'
import { adminJWT } from './Login.spec'
// import connection from '../../connection'

const { expect } = chai
chai.use(chaiUUID)

describe('UpdateRecord Controller', () => {
  let app

  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await app.close()
  })

  it(`#GET, /api/updaterecord`, async function () {
    const home = await supertest(app).get(`/api/updaterecord`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10
    })
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.count).to.deep.equal(1)
    expect(home.body.data.data[0]).to.have.all.keys([
      'uuid',
      'workCenter',
      'template',
      'templateVersion',
      'startTime',
      'createTime',
      'state'
    ])
    expect(home.body.data.data[0].uuid).to.deep.equal('70000003')
    expect(home.body.data.data[0].workCenter).to.deep.equal('北京')
    expect(home.body.data.data[0].template).to.deep.equal('模板管理服務')
    expect(home.body.data.data[0].templateVersion).to.deep.equal('dev-0.1')
    expect(home.body.data.data[0].startTime).to.deep.equal('2020-04-05T22:00:00.000Z')
    expect(home.body.data.data[0].createTime).to.deep.equal('2020-03-23T05:17:53.580Z')
    expect(home.body.data.data[0].state).to.deep.equal('init')
  })

  it(`#GET, /api/updaterecord/{uuid}`, async function () {
    const home = await supertest(app).get(`/api/updaterecord/70000003`).set('Authorization', `bearer ${adminJWT}`)
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.uuid).to.deep.equal('70000003')
    expect(home.body.data.workCenter).to.deep.equal('北京')
    expect(home.body.data.template).to.deep.equal('模板管理服務')
    expect(home.body.data.templateVersion).to.deep.equal('dev-0.1')
    expect(home.body.data.startTime).to.deep.equal('2020-04-05T22:00:00.000Z')
    expect(home.body.data.createTime).to.deep.equal('2020-03-23T05:17:53.580Z')
    expect(home.body.data.state).to.deep.equal('init')
  })
  it(`#POST, /api/updaterecord: 未開發使用, pending.`
    // async function () {
    // const home = await supertest(app).post(`/api/updaterecord`).set('Authorization', `bearer ${adminJWT}`).send({

    // })
    // expect(home.status).to.deep.equal(200)
    // expect(home.body.data.workCenter).to.deep.equal('北京')
    // expect(home.body.data.template).to.deep.equal('模板管理服務')
    // expect(home.body.data.templateVersion).to.deep.equal('dev-0.1')
    // expect(new Date(home.body.data.startTime)).to.deep.equal('2020-04-05T22:00:00.000Z')
    // expect(new Date(home.body.data.endTime)).to.deep.equal('2021-04-30T10:00:00.000Z')
    // }
  )
})
