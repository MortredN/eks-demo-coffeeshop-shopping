export const aggregateProductsToOrders = (ordersResult) => {
  let ordersWithProducts = []

  for (const row of ordersResult) {
    let exisitingOrder = ordersWithProducts.find((order) => order.id === row.orders.id)

    if (!exisitingOrder) {
      ordersWithProducts.push({
        ...row.orders,
        ...{
          products:
            row.products && row.orders_to_products
              ? [{ ...row.products, ...row.orders_to_products }]
              : []
        }
      })
    } else {
      row.products &&
        row.orders_to_products &&
        exisitingOrder.products.push({ ...row.products, ...row.orders_to_products })
    }
  }

  return ordersWithProducts
}
