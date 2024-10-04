import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

if (!process.env.DB_URL) {
  throw new Error('PostgreSQL DB credentials error')
}

const queryClient = postgres(process.env.DB_URL)
const db = drizzle(queryClient)

export default db
