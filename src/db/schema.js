import { relations } from 'drizzle-orm'
import {
  integer,
  numeric,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

/* Schema definition */
export const productTable = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  name: varchar('name', { length: 256 }).notNull(),
  subname: varchar('subname', { length: 256 }).notNull().unique(),
  brand: varchar('brand', { length: 256 }),
  price: numeric('price', { scale: 2 }).notNull(),
  image: varchar('image', { length: 512 }),
  format: varchar('format', { length: 256 }),
  quantity: varchar('quantity', { length: 256 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export const orderTable = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  customerId: varchar('customer_id', { length: 256 }).notNull(),
  customerEmail: varchar('customer_email', { length: 256 }).notNull(),
  customerName: varchar('customer_name', { length: 256 }).notNull(),
  subtotal: numeric('subtotal', { scale: 2 }).notNull(),
  tax: numeric('tax', { scale: 2 }),
  total: numeric('total', { scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export const ordersToProductsTable = pgTable(
  'orders_to_products',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => productTable.id),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orderTable.id),
    price: numeric('price', { scale: 2 }).notNull(),
    quantity: integer('quantity').notNull(),
    total: numeric('total', { scale: 2 }).notNull()
  },
  (table) => ({
    pk: primaryKey({ name: 'order_product_pk', columns: [table.productId, table.orderId] })
  })
)

/* Relations */

// Product + Order - M2M
export const productRelations = relations(productTable, ({ many }) => ({
  ordersToProducts: many(ordersToProductsTable)
}))
export const ordersRelations = relations(orderTable, ({ many }) => ({
  ordersToProducts: many(ordersToProductsTable)
}))
export const ordersToProductsRelations = relations(ordersToProductsTable, ({ one }) => ({
  product: one(productTable, {
    fields: [ordersToProductsTable.productId],
    references: [productTable.id]
  }),
  order: one(orderTable, {
    fields: [ordersToProductsTable.orderId],
    references: [orderTable.id]
  })
}))
