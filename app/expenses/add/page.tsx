import CreateOrModifyCard from "@/components/create-or-modify-card";

export default function CreateExpensePage() {
  return (
    <div className="mt-4 justify-items-center">
      <CreateOrModifyCard
        title="New expense"
        description="Add your new expense in the form"
        action="create"
      />
    </div>
  );
}
