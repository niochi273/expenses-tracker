import CreateOrModifyCard from "@/components/create-or-modify-card";
import { db } from "@/lib/db";
import { expenses } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface EditExpense {
  params: Promise<{ id: string }>;
}

export default async function EditExpense({ params }: EditExpense) {
  const { id } = await params;

  const [expense] = await db
    .select()
    .from(expenses)
    .where(eq(expenses.id, parseInt(id)));

  const { title, description, amount, category } = expense;

  const defaultValues = {
    title,
    description,
    category,
    amount,
  };

  return (
    <div className="mt-4 justify-items-center">
      <CreateOrModifyCard
        title="Modify expense"
        description="Change expense details in the form"
        action="edit"
        defaultValues={defaultValues}
        id={parseInt(id)}
      />
    </div>
  );
}
