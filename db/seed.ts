import * as dotenv from 'dotenv'
import { db } from '.'
import { tenants, users } from './schema'

dotenv.config({ path: './.env.local' })

if (!('DATABASE_URL' in process.env))
  throw new Error('DATABASE_URL not found on .env.development')

const main = async () => {
  const dataTenant: (typeof tenants.$inferInsert)[] = []
  dataTenant.push({
    id: 1,
    name: 'Default',
  })

  const dataUsers: (typeof users.$inferInsert)[] = []
  dataUsers.push({
    tenantId: 1,
    data: { name: 'Guest' },
  })

  console.log('Seed start')
  await db.insert(tenants).values(dataTenant)
  await db.insert(users).values(dataUsers)
  console.log('Seed done')
}

main()
