import z from "zod";

export const categories = [
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
] as const;

export const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(32, "Title must be at most 32 characters."),
  description: z
    .string()
    .max(100, "Description must be at most 100 characters."),
  category: z.enum(categories, { message: "Select category" }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter an amount like 12 or 12.50")
    .refine((v) => Number(v) > 0, "Amount must be greater than 0"),
});

export type Category = (typeof categories)[number];
