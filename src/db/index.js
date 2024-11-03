import { drizzle } from 'drizzle-orm/postgres-js'
import _ from 'lodash'
import postgres from 'postgres'

let queryClient

if (
  _.every(
    [process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_HOST, process.env.DB_DBNAME],
    (env) => !_.isEmpty(env)
  )
) {
  queryClient = postgres({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ?? 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    ssl: process.env.NODE_ENV != 'development' ? 'require' : false
  })
} else {
  if (!_.isEmpty(process.env.DB_URL)) {
    queryClient = postgres(process.env.DB_URL)
  } else {
    throw new Error('PostgreSQL DB credentials error')
  }
}

const db = drizzle(queryClient)

export default db
