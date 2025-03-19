import { sql } from "drizzle-orm";
import { pgTable, pgEnum, serial, text, varchar, timestamp, boolean, integer, uuid, smallint, real } from "drizzle-orm/pg-core";

export const gamers = pgTable("gamers", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  name: text("name"),
  age: smallint("age"),
  numChayas: smallint("num_chayas").default(0),
});
