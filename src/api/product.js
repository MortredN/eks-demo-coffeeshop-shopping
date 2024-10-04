import express from 'express'
import _ from 'lodash'
import { eq, getTableColumns } from 'drizzle-orm'
import db from '../db/index.js'
import { productTable } from '../db/schema.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const { createdAt, updatedAt, ...rest } = getTableColumns(productTable)
  const productsResult = await db.select({ ...rest }).from(productTable)
  return res.status(200).json({ products: productsResult })
})

router.get('/:subname', async (req, res) => {
  const { subname } = req.params
  const { createdAt, updatedAt, ...rest } = getTableColumns(productTable)
  const [productResult] = await db
    .select({ ...rest })
    .from(productTable)
    .where(eq(productTable.subname, subname))
    .limit(1)
  return res.status(200).json({ product: productResult })
})

export default router
