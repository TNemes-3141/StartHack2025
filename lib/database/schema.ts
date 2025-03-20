import { sql } from "drizzle-orm";
import { pgTable, serial, varchar, timestamp, integer, decimal, unique } from 'drizzle-orm/pg-core';

// export const gamers = pgTable("gamers", {
//   id: serial("id").primaryKey(),
//   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
//   name: text("name"),
//   age: smallint("age"),
//   numChayas: smallint("num_chayas").default(0),
// });

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow(),
});

export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  name: varchar('name', { length: 100 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const portfolioAssets = pgTable('portfolio_assets', {
  id: serial('id').primaryKey(),
  portfolio_id: integer('portfolio_id').references(() => portfolios.id),
  asset_type: varchar('asset_type', { length: 50 }).notNull(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  purchase_price: decimal('purchase_price', { precision: 12, scale: 2 }).notNull(),
  purchase_date: timestamp('purchase_date').defaultNow(),
  up_by: decimal('up_by'),
});
