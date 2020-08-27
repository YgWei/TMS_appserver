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

describe('Company Controller', () => {
  let app
  const createBody = {
    name: '上海'
  }
  const updateBody = {
    name: '上海1'
  }
  const productionBody = {
    name: '陽光團險',
    description: '這是陽光團險'
  }
  const productionUpdateBody = {
    name: '陽光團險1',
    description: '這是陽光團險1'
  }

  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await recover(['Company', 'Production'])
    await app.close()
  })

  it(`# GET, /api/company`, async function () {
    const home = await supertest(app).get(`/api/company`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10, type: 'select', name: '陽光'
    })
    expect(home.status).to.equal(200)
    expect(home.body.data.count).to.equal(1)
    expect(home.body.data.data[0]).to.have.all.keys(['uuid', 'name'])
  })

  it(`# GET, /api/company/60634`, async function () {
    const home = await supertest(app).get(`/api/company/60634`).set('Authorization', `bearer ${adminJWT}`)
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.uuid).to.equal('60634')
    expect(home.body.data.name).to.equal('陽光')
  })

  it(`# GET, /api/company/60634/production`, async function () {
    const home = await supertest(app).get(`/api/company/60634/production`).set('Authorization', `bearer ${adminJWT}`).query({
      start: 0, limit: 10, type: 'all'
    })
    expect(home.status).to.equal(200)
    expect(home.body.data.count).to.equal(1)
    expect(home.body.data.data[0]).to.have.all.keys(['uuid', 'companyKey', 'name', 'description'])
  })
  it(`# GET, /api/company/60634/production/68014`, async function () {
    const home = await supertest(app).get(`/api/company/60634/production/68014`).set('Authorization', `bearer ${adminJWT}`)
    expect(home.status).to.deep.equal(200)
    expect(home.body.data.uuid).to.deep.equal('68014')
    expect(home.body.data.name).to.deep.equal('陽光個險')
    expect(home.body.data.description).to.deep.equal('這是陽光個險')
  })

  describe('Create a new Company', () => {
    let newCompany = ''
    step(`# POST, /api/company`, async function () {
      const home = await supertest(app).post(`/api/company`).set('Authorization', `bearer ${adminJWT}`).send(createBody)
      expect(home.status).to.deep.equal(200)
      newCompany = home.body.data.uuid
      expect(home.body.data.name).to.deep.equal('上海')
    })

    step(`# GET, /api/company`, async function () {
      const home = await supertest(app).get(`/api/company`).set('Authorization', `bearer ${adminJWT}`).query({
        start: 0, limit: 10, type: 'select'
      })
      expect(home.status).to.equal(200)
      expect(home.body.data.count).to.equal(2)
      expect(home.body.data.data[0]).to.have.all.keys(['uuid', 'name'])
    })

    step(`# GET, /api/company/{newCompany}`, async function () {
      const home = await supertest(app).get(`/api/company/${newCompany}`).set('Authorization', `bearer ${adminJWT}`)
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.uuid).to.equal(newCompany)
      expect(home.body.data.name).to.equal('上海')
    })
  })

  describe('Update Company 60634', () => {
    step(`# PUT, /api/company/60634`, async function () {
      const home = await supertest(app).put(`/api/company/60634`).set('Authorization', `bearer ${adminJWT}`).send(updateBody)
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.name).to.deep.equal('上海1')
    })

    step(`# GET, /api/company/60634`, async function () {
      const home = await supertest(app).get(`/api/company/60634`).set('Authorization', `bearer ${adminJWT}`)
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.uuid).to.deep.equal('60634')
      expect(home.body.data.name).to.deep.equal('上海1')
    })
  })

  describe('Create a new Production.', () => {
    let newProductionKey = ''
    step(`# POST, /api/company/60634/production`, async function () {
      const home = await supertest(app).post(`/api/company/60634/production`).set('Authorization', `bearer ${adminJWT}`).send(productionBody)
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.name).to.equal('陽光團險')
      expect(home.body.data.companyKey).to.equal('60634')
      expect(home.body.data.description).to.equal('這是陽光團險')
      newProductionKey = home.body.data.uuid
    })

    step(`# GET, /api/company/60634/production`, async function () {
      const home = await supertest(app).get(`/api/company/60634/production`).set('Authorization', `bearer ${adminJWT}`).query({
        start: 0, limit: 10, type: 'all'
      })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.count).to.equal(2)
      expect(home.body.data.data[0]).to.have.all.keys(['uuid', 'companyKey', 'name', 'description'])
      const find = home.body.data.data.find((item) => {
        return item.uuid === newProductionKey
      })
      expect(find.name).to.equal('陽光團險')
    })

    step(`# GET, /api/company/60634/production/{newProductionKey}`, async function () {
      const home = await supertest(app).get(`/api/company/60634/production/${newProductionKey}`).set('Authorization', `bearer ${adminJWT}`)
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.uuid).to.equal(newProductionKey)
      expect(home.body.data.companyKey).to.equal('60634')
      expect(home.body.data.name).to.equal('陽光團險')
      expect(home.body.data.description).to.deep.equal('這是陽光團險')
    })
  })

  describe('Update Production 68014', () => {
    step(`# PUT, /api/company/60634/production/68014`, async function () {
      const home = await supertest(app).put(`/api/company/60634/production/68014`).set('Authorization', `bearer ${adminJWT}`).send(productionUpdateBody)
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.uuid).to.equal('68014')
      expect(home.body.data.companyKey).to.equal('60634')
      expect(home.body.data.name).to.equal('陽光團險1')
      expect(home.body.data.description).to.deep.equal('這是陽光團險1')
    })

    it(`# GET, /api/company/60634/production/68014`, async function () {
      const home = await supertest(app).get(`/api/company/60634/production/68014`).set('Authorization', `bearer ${adminJWT}`)
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.uuid).to.equal('68014')
      expect(home.body.data.companyKey).to.equal('60634')
      expect(home.body.data.name).to.equal('陽光團險1')
      expect(home.body.data.description).to.deep.equal('這是陽光團險1')
    })
  })
})
