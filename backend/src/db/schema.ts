import { pgTable, text, uuid, timestamp, boolean, varchar, integer, decimal, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  backgroundUrl: text('background_url'),
  themeColor: varchar('theme_color', { length: 7 }).default('#b670ff'),
  badgeTextGlow: boolean('badge_text_glow').default(false),
  badgeAnimation: boolean('badge_animation').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const links = pgTable('links', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 100 }),
  url: text('url').notNull(),
  iconType: varchar('icon_type', { length: 20 }),
  position: integer('position').default(0),
  createdAt: timestamp('created_at').defaultNow()
});

export const cosmetics = pgTable('cosmetics', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  previewUrl: text('preview_url'),
  createdAt: timestamp('created_at').defaultNow()
});

export const userCosmetics = pgTable('user_cosmetics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  cosmeticId: uuid('cosmetic_id').references(() => cosmetics.id),
  purchasedAt: timestamp('purchased_at').defaultNow()
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  paypalTransactionId: varchar('paypal_transaction_id', { length: 255 }).unique(),
  cosmeticId: uuid('cosmetic_id').references(() => cosmetics.id),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 20 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow()
});

export const analytics = pgTable('analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  visitDate: date('visit_date'),
  visitCount: integer('visit_count').default(0),
  clickCount: integer('click_count').default(0),
  visitorIp: varchar('visitor_ip', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  cosmetics: many(userCosmetics),
  transactions: many(transactions)
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
  links: many(links),
  analytics: many(analytics)
}));

export const linksRelations = relations(links, ({ one }) => ({
  profile: one(profiles, { fields: [links.profileId], references: [profiles.id] })
}));

export const userCosmeticsRelations = relations(userCosmetics, ({ one }) => ({
  user: one(users, { fields: [userCosmetics.userId], references: [users.id] }),
  cosmetic: one(cosmetics, { fields: [userCosmetics.cosmeticId], references: [cosmetics.id] })
}));
