import { sql } from "drizzle-orm";
import { pgTable, pgEnum, serial, text, varchar, timestamp, boolean, integer, uuid, smallint, real } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
