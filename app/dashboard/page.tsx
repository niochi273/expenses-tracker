import ExpensesByCategoryChart from "@/components/expenses-categories-chart";
import ExpensesOverTimeChart from "@/components/expenses-time-chart";
import { db } from "@/lib/db";
import { expenses } from "@/lib/schema";

export default async function Dashboard() {
  const expensesList = await db.select().from(expenses);

  return (
    <div className="p-8 flex flex-col gap-4 items-center">
      {expensesList.length === 0 ? (
        <p>No expenses</p>
      ) : (
        <>
          <ExpensesOverTimeChart
            expenses={expensesList}
            referenceDate={new Date()}
          />
          <ExpensesByCategoryChart expenses={expensesList} />
        </>
      )}
    </div>
  );
}
