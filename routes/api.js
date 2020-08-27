'use strict'

import { SwaggerRouter } from 'koa-swagger-decorator'
import pkginfo from '../package.json'
import HomeController from '../controller/Home'
import LoginController from '../controller/Login'
import CompanyController from '../controller/Company'
import TemplateController from '../controller/Template'
import DeploymentController from '../controller/Deployment'
import DataController from '../controller/Data'
import ReleaseController from '../controller/Release'
import WorkCenterController from '../controller/WorkCenter'
import NotifyController from '../controller/Notify'
import ReviewController from '../controller/Review'
// import ProductOwnerController from '../controller/ProductOwner'
import SyncController from '../controller/Sync'
import UserController from '../controller/User'
import GitlabController from '../controller/Gitlab'
import UpdateRecordController from '../controller/UpdateRecord'
import PreProcessController from '../controller/preProcess'
import ClientController from '../controller/Client'
import RenderTestController from '../controller/RenderTest'

const router = new SwaggerRouter()

router.swagger({
  title: pkginfo.name,
  description: pkginfo.description,
  version: pkginfo.version,

  // [optional] default is root path.
  prefix: '/api',

  // [optional] default is /swagger-html
  swaggerHtmlEndpoint: '/swagger-html',

  // [optional] default is /swagger-json
  swaggerJsonEndpoint: '/swagger-json',

  // [optional] additional options for building swagger doc
  // eg. add api_key as shown below
  swaggerOptions: {
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    }
  }
})
router.map(HomeController, { doValidation: true })
router.map(LoginController, { doValidation: true })
router.map(CompanyController, { doValidation: true })
router.map(TemplateController, { doValidation: true })
router.map(DeploymentController, { doValidation: true })
router.map(DataController, { doValidation: true })
router.map(ReleaseController, { doValidation: true })
router.map(WorkCenterController, { doValidation: true })
router.map(NotifyController, { doValidation: true })
router.map(ReviewController, { doValidation: true })
// router.map(ProductOwnerController, { doValidation: true })
router.map(SyncController, { doValidation: true })
router.map(UserController, { doValidation: true })
router.map(GitlabController, { doValidation: true })
router.map(UpdateRecordController, { doValidation: true })
router.map(PreProcessController, { doValidation: true })
router.map(ClientController, { doValidation: true })
router.map(RenderTestController, { doValidation: true })

export default router
