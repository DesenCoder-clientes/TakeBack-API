import * as dotenv from 'dotenv'
import 'reflect-metadata'
import * as express from 'express'
import * as cors from 'cors'
import './database'

import SupportRoutes from './routes/SupportRoutes'
import ConsumerRoutes from './routes/ConsumerRoutes'

const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/support', SupportRoutes)
app.use('/consumer', ConsumerRoutes)

app.listen(process.env.PORT || 3333)