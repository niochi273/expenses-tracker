import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  numeric,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "Housing",
  "Utilities",
  "Groceries",
  "Transportation",
  "Healthcare",
  "Dining Out",
  "Entertainment",
  "Personal Care",
  "Clothing",
  "Gifts",
  "Debt",
  "Savings",
  "Vacation",
]);

export const expenses = pgTable("Expenses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp().defaultNow().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: categoryEnum("category").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
});
