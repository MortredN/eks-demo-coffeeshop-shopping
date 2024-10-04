import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config'

import routerProduct from './api/product.js'
import routerOrder from './api/order.js'

const app = express()
const PORT = process.env.PORT || 4002

app.use(bodyParser.json())
app.use(cors())
app.use(morgan("tiny"));

app.use('/product', routerProduct)
app.use('/order', routerOrder)

app
  .listen(PORT, () => {
    console.log('Server running at port', PORT)
  })
  .on('error', (err) => {
    throw new Error(err.message)
  })
