import { Router } from 'express'

import * as SupportController from '../controllers/supportControllers/GenerateSeedDataController'
import * as TestsController from '../controllers/supportControllers/TestSendMailController'

const routes = Router()

routes.get('/generate-initial-data', SupportController.GenerateSeedDataController)
routes.get('/find-all-clients', SupportController.FindAllClients)
routes.post('/test-send-mail', TestsController.TestSendMail)

export default routes