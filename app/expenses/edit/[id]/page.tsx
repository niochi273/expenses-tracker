import CreateOrModifyCard from "@/components/create-or-modify-card";

interface EditExpense {
  searchParams: Promise<{ id: string }>;
}

export default async function EditExpense({ searchParams }: EditExpense) {
  const { id } = await searchParams;

  const defaultValues = {
    title: "Bus fare",
    description: "Bus 170",
    category: "Transportation",
    amount: "100",
  };

  return (
    <div className="mt-4 justify-items-center">
      <CreateOrModifyCard
        title="Modify expense"
        description="Change expense details in the form"
        action="edit"
        defaultValues={defaultValues}
      />
    </div>
  );
}
