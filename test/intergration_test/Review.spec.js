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

describe('Review Controller:', () => {
  let app

  before(async () => {
    app = await createServer()
  })
  after(async () => {
    await recover(['Notify', 'Review', 'ReviewRecord'])
    await app.close()
  })
  describe('#POST, /api/review/10800/reviewGroup:', () => {
    step(`Add error user test.`, async function () {
      const home = await supertest(app).post(`/api/review/10800/reviewGroup`)
        .set('Authorization', `bearer ${adminJWT}`).send({ userUuid: ['errorUser'] })
      expect(home.status).to.deep.equal(404)
    })
    step(`Add duplicate user test.`, async function () {
      const home = await supertest(app).post(`/api/review/10800/reviewGroup`)
        .set('Authorization', `bearer ${adminJWT}`).send({ userUuid: ['aa2230fe-f004-441d-bc77-48569d590eb9'] })
      expect(home.status).to.deep.equal(500)
    })
    step(`Add template user test.`, async function () {
      const home = await supertest(app).post(`/api/review/10800/reviewGroup`)
        .set('Authorization', `bearer ${adminJWT}`).send({ userUuid: ['170ad7bc-3ca5-421a-9f15-95cca073749b'] })
      expect(home.status).to.deep.equal(200)
      expect(home.body.data.reviewGroup.length).to.deep.equal(2)
      expect(home.body.data.reviewGroup[1]).to.deep.equal({ uuid: '170ad7bc-3ca5-421a-9f15-95cca073749b', name: '模板管理平台' })
    })
  })
})
