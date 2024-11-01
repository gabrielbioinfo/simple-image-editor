import { migrate } from "drizzle-orm/neon-http/migrator"
import { db } from "."

(async () => {
  try {
    await migrate(db, {
      migrationsFolder: 'db/migrations'
    })
    console.log('Migration completed!')
  } catch (e) {
    console.error('Error during migration: ', e)
    process.exit(1)
  }
})()
