"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction, Budget } from "@/lib/types"

interface SpendingInsightsProps {
  transactions: Transaction[]
  budgets: Budget[]
}

export default function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  // Calculate total spending for current month
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const totalSpent = transactions
    .filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const getBudgetStatus = () => {
    if (spentPercentage <= 80) return "Under Budget"
    if (spentPercentage <= 100) return "Near Limit"
    return "Over Budget"
  }

  const getBudgetStatusColor = () => {
    if (spentPercentage <= 80) return "bg-green-500"
    if (spentPercentage <= 100) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-baseline">
          <h3 className="text-lg font-semibold">Monthly Budget</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              spentPercentage <= 80
                ? "bg-green-100 text-green-800"
                : spentPercentage <= 100
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {getBudgetStatus()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>${totalSpent.toFixed(2)} spent</span>
          <span>of ${totalBudget.toFixed(2)}</span>
        </div>

        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-300 ${getBudgetStatusColor()}`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </div>

        <p className="text-sm text-gray-500">
          {spentPercentage.toFixed(0)}% of your monthly budget
        </p>
      </CardContent>
    </Card>
  )
}
