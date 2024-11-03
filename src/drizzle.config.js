import { defineConfig } from 'drizzle-kit'
import _ from 'lodash'

let dbCredentials

if (
  _.every(
    [process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_HOST, process.env.DB_DBNAME],
    (env) => !_.isEmpty(env)
  )
) {
  dbCredentials = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ?? 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    ssl: process.env.NODE_ENV != 'development' ? 'require' : false
  }
} else {
  if (!_.isEmpty(process.env.DB_URL)) {
    dbCredentials = { url: process.env.DB_URL }
  } else {
    throw new Error('PostgreSQL DB credentials error')
  }
}

export default defineConfig({
  schema: './src/db/schema.js',
  out: './src/db/migrations',
  dbCredentials,
  dialect: 'postgresql'
})
