import express from 'express'
import _ from 'lodash'
import { and, eq, getTableColumns, inArray } from 'drizzle-orm'
import db from '../db/index.js'
import { ordersToProductsTable, orderTable, productTable } from '../db/schema.js'
import { authenticateToken } from '../middlewares/auth.js'
import { aggregateProductsToOrders } from '../utils/aggregate.js'

const router = express.Router()
const customerApiUrl = process.env.API_CUSTOMER_URL

router.get('/', authenticateToken, async (req, res) => {
  const customer = req.customer

  const { id, createdAt, total } = getTableColumns(orderTable)
  const ordersResult = await db
    .select({ id, createdAt, total })
    .from(orderTable)
    .where(eq(orderTable.customerId, customer?.id))

  return res.status(200).json({ orders: ordersResult })
})

router.get('/:id', authenticateToken, async (req, res) => {
  let customer = req.customer
  const { id } = req.params

  const ordersResult = await db
    .select()
    .from(orderTable)
    .innerJoin(ordersToProductsTable, eq(ordersToProductsTable.orderId, orderTable.id))
    .innerJoin(productTable, eq(ordersToProductsTable.productId, productTable.id))
    .where(and(eq(orderTable.customerId, customer?.id), eq(orderTable.id, id)))

  const orders = aggregateProductsToOrders(ordersResult)

  return res.status(200).json({ order: orders[0] })
})

router.post('/', async (req, res) => {
  let customer = req.customer
  const { products, email, password, name } = req.body

  if (!Array.isArray(products) || products.length < 1) {
    return res.status(400).json('No products in cart')
  }

  if (products.some((p) => !p.quantity)) {
    return res.status(400).json('Invalid quantity')
  }

  const foundProducts = await db
    .select()
    .from(productTable)
    .where(
      inArray(
        productTable.id,
        products.map((p) => p.id)
      )
    )
  if (foundProducts.length != products.length) {
    return res.status(400).json('Invalid product')
  }

  if (!customerApiUrl && !_.isEmpty(email) && !_.isEmpty(password) && !_.isEmpty(name)) {
    return res.status(500).json('Internal Server Error')
  }

  let accessToken = null
  let refreshToken = null
  if (customerApiUrl) {
    if (!_.isEmpty(email) && !_.isEmpty(password) && !_.isEmpty(name)) {
      const registerRes = await fetch(`${customerApiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      const registerData = await registerRes.json()
      customer = registerData?.customer
      accessToken = registerData?.accessToken
      refreshToken = registerData?.refreshToken
    } else {
      const infoRes = await fetch(`${customerApiUrl}/me/info`, {
        method: 'GET',
        headers: { Authorization: req.headers['authorization'] }
      })
      customer = (await infoRes.json())?.customer
    }
  }

  let newOrder = (
    await db
      .insert(orderTable)
      .values({
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        subtotal: 0,
        tax: 0,
        total: 0
      })
      .returning()
  )[0]

  let subtotal = 0
  const insertProducts = []
  for (const foundProduct of foundProducts) {
    const foundQuantity = products.find((p) => p.id === foundProduct.id).quantity
    const total = Math.round(foundProduct.price * foundQuantity * 100) / 100
    insertProducts.push({
      orderId: newOrder.id,
      productId: foundProduct.id,
      price: foundProduct.price,
      quantity: foundQuantity,
      total
    })
    subtotal += total
  }

  await db.insert(ordersToProductsTable).values(insertProducts)

  const tax = Math.round(subtotal * 0.13 * 100) / 100
  const total = subtotal + tax

  newOrder = await db
    .update(orderTable)
    .set({ subtotal, tax, total })
    .where(eq(orderTable.id, newOrder.id))
    .returning()

  return res.status(200).json({ order: newOrder, customer, accessToken, refreshToken })
})

export default router
