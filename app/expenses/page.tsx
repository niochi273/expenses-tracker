import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChartColumnStacked, Clock, SquarePen, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ExpensesPage() {
  const expenses = [
    {
      id: 1,
      amount: 100,
      name: "Bus fare",
      time: "07/18/2026",
      category: "transport",
      notes: "Cafe internship",
    },
    {
      id: 2,
      amount: 100,
      name: "Bus fare",
      time: "07/18/2026",
      category: "transport",
      notes: "Bus 170 to Novosibirsk",
    },
  ];

  const formatExpenseDate = (dateInput: Date | string) => {
    const date = new Date(dateInput);

    // Normalize today's date to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize yesterday's date to midnight
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Normalize the target expense date to midnight
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    // Compare timestamps
    if (compareDate.getTime() === today.getTime()) {
      return "Today";
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      // Returns a clean date string (e.g., "Jul 18, 2026")
      return date.toLocaleDateString("en-US", {
        dateStyle: "medium",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-background">
      {expenses.map((expense) => (
        <Card key={expense.id}>
          <CardHeader>
            <CardTitle className="text-lg">{expense.name}</CardTitle>
            <CardDescription>
              <span>{expense.notes}</span>
            </CardDescription>
            <CardAction>
              <Button className="cursor-pointer" variant="link">
                <Link
                  className="flex flex-row items-center gap-1"
                  href={`/expenses/${expense.id}/edit`}
                >
                  <span>Edit</span>
                  <SquarePen className="size-3" />
                </Link>
              </Button>
            </CardAction>
            <Separator />
          </CardHeader>
          <CardContent className="h-full flex flex-col justify-end">
            <p className="flex flex-row capitalize justify-between">
              <span>
                <ChartColumnStacked className="size-4 inline" /> Category:
              </span>
              <span>{expense.category}</span>
            </p>
            <p className="flex flex-row capitalize justify-between text-end">
              <span>
                <Clock className="size-4 inline" /> Time:
              </span>
              <span>{formatExpenseDate(expense.time)}</span>
            </p>
          </CardContent>
          <CardFooter>
            <p>Amount: {expense.amount}</p>
            <Button className="ml-auto" variant="destructive">
              <Trash2 />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
