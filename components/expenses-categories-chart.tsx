"use client";

import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { categories, type Category } from "@/lib/validations";

/** Only the field this chart actually reads — pass your full rows, they'll fit. */
type Expense = {
  category: Category;
};

interface ExpensesByCategoryChartProps {
  expenses: Expense[];
}

/**
 * Recharts config keys end up in CSS custom properties (`--color-<key>`),
 * so a category like "Food & Drink" has to be slugged first.
 */
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The default shadcn theme ships five chart tokens; cycle if you add categories. */
function colorFor(index: number, total: number) {
  const hue = Math.round((index * 360) / total);
  const step = index % 3;
  return {
    light: `oklch(${0.55 + step * 0.08} 0.16 ${hue})`,
    dark: `oklch(${0.65 + step * 0.07} 0.14 ${hue})`,
  };
}

const chartConfig = {
  count: { label: "Expenses" },
  ...Object.fromEntries(
    categories.map((category, index) => [
      slugify(category),
      { label: category, theme: colorFor(index, categories.length) },
    ]),
  ),
} satisfies ChartConfig;

export default function ExpensesByCategoryChart({
  expenses,
}: ExpensesByCategoryChartProps) {
  const chartData = useMemo(() => {
    const counts = new Map<string, number>();

    for (const expense of expenses) {
      counts.set(expense.category, (counts.get(expense.category) ?? 0) + 1);
    }

    return categories
      .map((category) => {
        const key = slugify(category);
        return {
          key,
          category,
          count: counts.get(category) ?? 0,
          fill: `var(--color-${key})`,
        };
      })
      .filter((slice) => slice.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [expenses]);

  const total = chartData.reduce((sum, slice) => sum + slice.count, 0);

  return (
    <Card className="flex w-full flex-col sm:max-w-md">
      <CardHeader>
        <CardTitle>Expenses by category</CardTitle>
        <CardDescription>How your entries are split up</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {total === 0 ? (
          <p className="text-muted-foreground py-16 text-center text-sm text-balance">
            Nothing tracked yet. Add an expense and the breakdown appears here.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-75"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent nameKey="key" hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="key"
                innerRadius={68}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                      return null;
                    }

                    const cx = viewBox.cx ?? 0;
                    const cy = viewBox.cy ?? 0;

                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={cx}
                          y={cy - 4}
                          className="fill-foreground text-3xl font-semibold tabular-nums"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          {total === 1 ? "expense" : "expenses"}
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
              <ChartLegend
                content={
                  <ChartLegendContent
                    nameKey="key"
                    className="flex-wrap gap-x-4 gap-y-1.5"
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
