"use client"

import React from "react"
import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { getCategoryById } from "@/lib/categories"
import type { Transaction, Budget, BudgetComparison } from "@/lib/types"

interface BudgetComparisonChartProps {
  transactions: Transaction[]
  budgets: Budget[]
}

export default function BudgetComparisonChart({ transactions, budgets }: BudgetComparisonChartProps) {
  const chartData = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    // Filter current month's transactions
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    // Calculate actual spending by category
    const actualSpending: Record<string, number> = {}
    monthlyTransactions.forEach(transaction => {
      if (transaction.category) {
        actualSpending[transaction.category] = (actualSpending[transaction.category] || 0) + transaction.amount
      }
    })

    // Combine budget and actual data
    return budgets.map(budget => {
      const actual = actualSpending[budget.category] || 0
      const category = getCategoryById(budget.category)
      return {
        name: category.name,
        budget: budget.amount,
        actual: actual,
        percentage: actual / budget.amount * 100
      }
    })
  }, [transactions, budgets])

  if (!chartData.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <p className="text-sm text-muted-foreground">Set budgets to see comparison.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip
          formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
          labelStyle={{ fontSize: 12 }}
        />
        <Legend />
        <Bar name="Budget" dataKey="budget" fill="hsl(var(--chart-1))" />
        <Bar name="Actual" dataKey="actual" fill="hsl(var(--chart-2))" />
      </BarChart>
    </ResponsiveContainer>
  )
}
