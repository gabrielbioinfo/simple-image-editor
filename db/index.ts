import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'

config({ path: ".env.local" })

const sql = neon('postgresql://neondb_owner:qy3eoFJ6sjAT@ep-solitary-unit-a5in5b4m.us-east-2.aws.neon.tech/neondb?sslmode=require')

// logger
const db = drizzle(sql, { logger: true })
// const db = drizzle(sql)

export { db }
