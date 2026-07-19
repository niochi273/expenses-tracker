CREATE TYPE "public"."category" AS ENUM('Housing', 'Utilities', 'Groceries', 'Transportation', 'Healthcare', 'Dining Out', 'Entertainment', 'Personal Care', 'Clothing', 'Gifts', 'Debt', 'Savings', 'Vacation');--> statement-breakpoint
CREATE TABLE "Expenses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Expenses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" "category" NOT NULL,
	"amount" text NOT NULL
);
