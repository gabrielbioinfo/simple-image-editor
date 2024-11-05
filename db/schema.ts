import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  name: varchar('name').unique().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  clerkId: varchar('clerk_id'),
  guest: boolean('guest').notNull().default(false),
  data: jsonb('data'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  sourceImageId: integer('source_image_id'),

  version: integer('version').default(1),
  name: varchar('name', { length: 32 }).notNull(),

  cid: text('cid').notNull(),
  url: text('url').notNull(),
  uploadData: jsonb('uploadData'),

  status: boolean('status').notNull().default(false),
  archived: boolean('archived').notNull().default(false),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
}))

export const usersRelations = relations(users, ({ many, one }) => ({
  images: many(images),
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
}))

export const imagesRelations = relations(images, ({ one }) => ({
  user: one(users, {
    fields: [images.userId],
    references: [users.id],
  }),
}))

export type TenantModel = InferSelectModel<typeof tenants>

export type UserModel = InferSelectModel<typeof users>
export type UserInsertModel = InferInsertModel<typeof users>

export type ImageModel = InferSelectModel<typeof images>
export type ImageInsertModel = InferInsertModel<typeof images>
