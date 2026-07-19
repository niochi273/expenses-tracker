"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { expenses } from "./schema";
import { formSchema } from "./validations";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function createExpense(input: unknown) {
  const data = formSchema.parse(input);
  await db.insert(expenses).values(data);
  revalidatePath("/expenses");
  redirect("/expenses"); // adjust to your route
}

export async function updateExpense(input: unknown, id: number) {
  const data = formSchema.parse(input);
  await db.update(expenses).set(data).where(eq(expenses.id, id));
  revalidatePath("/expenses");
  redirect("/expenses"); // adjust to your route
}

export async function deleteExpense(id: number) {
  await db.delete(expenses).where(eq(expenses.id, id));
  revalidatePath("/expenses");
}
