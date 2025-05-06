"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { Transaction } from "@/lib/types"

interface ExpensesChartProps {
  transactions: Transaction[]
}

export default function ExpensesChart({ transactions }: ExpensesChartProps) {
  const chartData = useMemo(() => {
    // Group transactions by month
    const monthlyData: Record<string, number> = {}

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`
      const monthName = date.toLocaleString("default", { month: "short", year: "2-digit" })

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0
      }

      monthlyData[monthYear] += transaction.amount
    })

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([monthYear, amount]) => {
        const [year, month] = monthYear.split("-")
        return {
          month: new Date(Number.parseInt(year), Number.parseInt(month) - 1).toLocaleString("default", {
            month: "short",
            year: "2-digit",
          }),
          amount: Number.parseFloat(amount.toFixed(2)),
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.month)
        const dateB = new Date(b.month)
        return dateA.getTime() - dateB.getTime()
      })
  }, [transactions])

  const chartConfig = {
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="w-full h-[300px] md:h-full">
      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
          <p className="text-sm text-muted-foreground">No transaction data available to display chart.</p>
        </div>
      ) : (
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, "Amount"]}
                labelStyle={{ fontSize: 12 }}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar
                dataKey="amount"
                fill="#f47560"
                radius={[4, 4, 0, 0]}
                barSize={25}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
