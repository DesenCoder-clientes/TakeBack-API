import 'reflect-metadata'
import * as express from 'express'
import * as cors from 'cors'
import './database'

import SupportRoutes from './routes/SupportRoutes'
import ClientRoutes from './routes/ClientRoutes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/support', SupportRoutes)
app.use('/client', ClientRoutes)

app.listen(3333)