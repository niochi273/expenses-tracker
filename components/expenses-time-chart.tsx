"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/** Only the fields this chart reads. Rename `createdAt` if your column differs. */

/** Only the fields this chart reads — pass your full rows, they'll fit. */
type Expense = {
  amount: string | number;
  created_at: Date | string;
};

interface ExpensesOverTimeChartProps {
  expenses: Expense[];
  /**
   * Pass the server's `new Date()` down to keep SSR and hydration on the same
   * day — otherwise a server in UTC and a browser in another zone can disagree
   * around midnight. Defaults to the client clock.
   */
  referenceDate?: Date;
}

type Range = "week" | "month";

const RANGE_DAYS: Record<Range, number> = { week: 7, month: 30 };

// Explicit locales keep server and client output identical. Swap to taste.
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});
const axisMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const weekdayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const shortDateLabel = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const fullDateLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

/** Local-time day bucket, so an expense at 23:00 doesn't slide into tomorrow. */
function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

const chartConfig = {
  total: {
    label: "Spent",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function ExpensesOverTimeChart({
  expenses,
  referenceDate,
}: ExpensesOverTimeChartProps) {
  const [range, setRange] = useState<Range>("week");

  const now = useMemo(() => referenceDate ?? new Date(), [referenceDate]);

  const chartData = useMemo(() => {
    const totals = new Map<string, number>();

    for (const expense of expenses) {
      const date = new Date(expense.created_at);
      const amount = Number(expense.amount);
      if (Number.isNaN(date.getTime()) || Number.isNaN(amount)) continue;

      const key = dayKey(date);
      totals.set(key, (totals.get(key) ?? 0) + amount);
    }

    const days = RANGE_DAYS[range];
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    return Array.from({ length: days }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      return {
        label:
          range === "week"
            ? weekdayLabel.format(date)
            : shortDateLabel.format(date),
        fullLabel: fullDateLabel.format(date),
        total: totals.get(dayKey(date)) ?? 0,
      };
    });
  }, [expenses, range, now]);

  const rangeTotal = chartData.reduce((sum, day) => sum + day.total, 0);
  const days = RANGE_DAYS[range];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Spending over time</CardTitle>
        <CardDescription>
          {rangeTotal > 0
            ? `${money.format(rangeTotal)} in the last ${days} days`
            : `Nothing recorded in the last ${days} days`}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            variant="outline"
            size="sm"
            value={[range]}
            onValueChange={(value) => {
              const next = value[0];
              if (next === "week" || next === "month") setRange(next);
            }}
            aria-label="Time range"
          >
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 8, right: 12, left: 4, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              interval={range === "week" ? 0 : "preserveStartEnd"}
            />
            <YAxis
              width={64}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => axisMoney.format(Number(value))}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullLabel ?? ""
                  }
                  formatter={(value) => (
                    <div className="flex w-full items-center justify-between gap-6">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {money.format(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Line
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={
                range === "week" ? { fill: "var(--color-total)", r: 3 } : false
              }
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
