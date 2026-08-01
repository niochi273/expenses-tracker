# Expenses Tracker

A small personal expense tracker built with Next.js 16 (App Router), React 19, Drizzle ORM and Postgres (Neon). Add expenses, edit or delete them, and see where the money goes on a dashboard with two charts.

## Features

- **Expense list** (`/expenses`) — all entries as cards, newest first, with human-friendly dates ("Today", "Yesterday", `Jul 18, 2026`).
- **Create / edit** (`/expenses/add`, `/expenses/edit/[id]`) — one shared form component driven by TanStack Form with Zod validation on submit.
- **Delete** — destructive action guarded by a confirmation dialog.
- **Dashboard** (`/dashboard`) — spending over time (line chart, week/month toggle) and a breakdown by category (donut chart), built on Recharts.
- **13 fixed categories** — Housing, Utilities, Groceries, Transportation, Healthcare, Dining Out, Entertainment, Personal Care, Clothing, Gifts, Debt, Savings, Vacation — enforced as a Postgres enum and a Zod enum from a single source.
- Data mutations run as **React Server Actions** with `revalidatePath`, so the list and dashboard refresh without client-side fetching.

## Tech stack

| Layer     | Choice                                                                                    |
| --------- | ----------------------------------------------------------------------------------------- |
| Framework | Next.js 16.2 (App Router, Server Components, Server Actions)                              |
| UI        | React 19.2, Tailwind CSS v4, shadcn/ui (`base-nova` style) on Base UI, lucide-react icons |
| Forms     | TanStack React Form + Zod v4                                                              |
| Charts    | Recharts 3                                                                                |
| Database  | Postgres via Neon serverless driver                                                       |
| ORM       | Drizzle ORM + drizzle-kit migrations                                                      |

## Project structure

```
app/
  layout.tsx              # Root layout + sticky nav bar
  page.tsx                # Redirects / -> /expenses
  expenses/page.tsx       # Expense list (server component)
  expenses/add/page.tsx   # Create form
  expenses/edit/[id]/     # Edit form, prefilled from the DB
  dashboard/page.tsx      # Charts
  globals.css             # Tailwind v4 + theme tokens
components/
  create-or-modify-card.tsx     # Shared create/edit form
  delete-button.tsx             # Delete + confirmation dialog
  expenses-time-chart.tsx       # Spending over time
  expenses-categories-chart.tsx # Spending by category
  ui/                           # shadcn/ui primitives
lib/
  db.ts           # Drizzle client (Neon HTTP)
  schema.ts       # Drizzle table + category enum
  validations.ts  # Zod form schema + category list
  actions.ts      # Server actions: create / update / delete
  format.ts       # Shared currency formatter
  utils.ts        # cn() helper
drizzle/          # Generated SQL migrations + snapshots
```

## Data model

Table `Expenses`:

| Column        | Type             | Notes                                     |
| ------------- | ---------------- | ----------------------------------------- |
| `id`          | `integer`        | primary key, generated always as identity |
| `created_at`  | `timestamp`      | defaults to `now()`                       |
| `title`       | `text`           | required, 3–32 chars                      |
| `description` | `text`           | optional, max 100 chars                   |
| `category`    | `category` enum  | required, one of the 13 categories        |
| `amount`      | `numeric(12, 2)` | required, positive                        |

## Getting started

### Prerequisites

- Node.js 20+
- A Postgres database (a [Neon](https://neon.tech) project works out of the box; the app uses the Neon HTTP driver)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgres://user:password@host/db?sslmode=require"
```

> **Note:** `lib/db.ts` loads plain `.env`, while `drizzle.config.ts` loads `.env.local`. Either keep the same `DATABASE_URL` in both files, or align them on one file before running migrations.

### 3. Apply migrations

```bash
npx drizzle-kit migrate
```

To regenerate migrations after changing `lib/schema.ts`:

```bash
npx drizzle-kit generate
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/expenses`.

## Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Production build             |
| `npm run start` | Serve the production build   |
| `npm run lint`  | Run ESLint                   |

## Adding a category

Categories live in two places that must stay in sync:

1. `lib/schema.ts` — the `categoryEnum` (a Postgres enum, so it needs a migration).
2. `lib/validations.ts` — the `categories` array used by the form and the charts.

Update both, then run `npx drizzle-kit generate && npx drizzle-kit migrate`. The category chart derives its colors from the array length, so new entries are colored automatically.

## Notes & known rough edges

- Amounts are displayed as raw strings on the expense list; `lib/format.ts` exports a EUR `Intl.NumberFormat` that isn't wired in there yet.
- Currency is hardcoded to EUR in the charts and formatter.
- `/expenses/edit/[id]` assumes the id exists and will throw on an unknown id.
- There is no auth — all expenses are global to the database.
