/* eslint-disable no-unused-expressions */
import chai from 'chai'
import chaiUUID from 'chai-uuid'
import { describe, before, after } from 'mocha'
import supertest from 'supertest'
import { adminJWT } from './Login.spec'
import createServer from '../../index'
import { deleteFile } from '../util/cloudstorage'
import { recover } from '../init/connection'
import { step } from 'mocha-steps'

const { expect } = chai
chai.use(chaiUUID)
describe('Data Controller', () => {
  let app
  let cloudStorageUuid = ''
  let dataUuid = ''
  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await recover(['Data'])
    await deleteFile(cloudStorageUuid)
    await app.close()
  })
  step('# POST, /api/data', async function () {
    const res = await supertest(app).post('/api/data').set('Authorization', `bearer ${adminJWT}`).field({
      productionUuid: '68014',
      name: 'testXml',
      description: 'This is a test file'
    }).attach('file', 'test/testFile/testXml.xml')
    const body = res.body
    dataUuid = body.data._key
    cloudStorageUuid = body.data.cloudStorageUuid
    expect(body.status).to.equal('success')
    expect(body.data.productionKey).to.equal('68014')
    expect(body.data.description).to.equal('This is a test file')
    expect(body.data.name).to.equal('testXml')
    expect(body.data.cloudStorageUuid).to.not.be.null
    expect(body.data.md5).to.not.be.null
    expect(body.data.fileName).to.not.be.null
  })

  step('# GET, /api/data', async function () {
    const res = await supertest(app).get('/api/data').set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10, type: 'all'
    })
    const body = res.body
    expect(body.status).to.equal('success')
    expect(body.data.count).to.equal(2)
    expect(body.data.data[0]).to.have.all.keys(['uuid', 'company', 'production', 'name', 'cloudStorageUuid', 'md5', 'description', 'createTime', 'createUser', 'invalid'])
  })

  step('# GET, /api/data/{uuid}', async function () {
    const res = await supertest(app).get(`/api/data/${dataUuid}`).set('Authorization', `bearer ${adminJWT}`)
    const body = res.body
    expect(body.status).to.equal('success')
    expect(body.data.company.uuid).to.equal('60634')
    expect(body.data.company.name).to.equal('陽光')
    expect(body.data.production.uuid).to.equal('68014')
    expect(body.data.production.name).to.equal('陽光個險')
    expect(body.data.description).to.deep.equal('This is a test file')
    expect(body.data.name).to.deep.equal('testXml')
    expect(body.data.cloudStorageUuid).to.equal(cloudStorageUuid)
  })

  step('# PUT, /api/data/{uuid}', async function () {
    const res = await supertest(app).put(`/api/data/${dataUuid}`)
      .set('Authorization', `bearer ${adminJWT}`)
      .send({
        companyUuid: 'f4a7aa98-e440-45b2-ae35-38d9952b283b',
        productionUuid: '68014',
        description: 'a new description'
      })
    const body = res.body
    expect(body.status).to.equal('success')
    expect(body.data.company).to.equal('陽光')
    expect(body.data.production).to.equal('陽光個險')
    expect(body.data.description).to.deep.equal('a new description')
    expect(body.data.name).to.deep.equal('testXml')
    expect(body.data.cloudStorageUuid).to.equal(cloudStorageUuid)
  })

  step('# DELETE, /api/data/{uuid}', async function () {
    const res = await supertest(app).delete(`/api/data/${dataUuid}`).set('Authorization', `bearer ${adminJWT}`)
    const body = res.body
    expect(body.status).to.equal('success')
  })
})
