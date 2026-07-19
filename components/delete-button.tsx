"use client";

import { deleteExpense } from "@/lib/actions";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export function DeleteButton({ id }: { id: number }) {
  return (
    <Button
      onClick={async () => {
        await deleteExpense(id);
      }}
      className="ml-auto"
      variant="destructive"
    >
      <Trash2 />
    </Button>
  );
}
