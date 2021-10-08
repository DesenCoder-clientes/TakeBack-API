import { Router } from 'express'

import * as Generic from '../controllers/general-controllers/FindGenericDataController'
import * as Auth from '../controllers/clients-controlles/AuthController'

const routes = Router()

routes.get('/find-all-cities', Generic.getAllCities)

routes.post('/sign-in', Auth.signIn)
routes.post('/sign-up', Auth.registerNewClient)
routes.post('/confirm-email', Auth.confirmationEmail)

export default routes