"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categories, getCategoryById } from "@/lib/categories"
import type { Transaction } from "@/lib/types"

interface DashboardSummaryProps {
  transactions: Transaction[]
}

export default function DashboardSummary({ transactions }: DashboardSummaryProps) {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const stats = useMemo(() => {
    // Filter transactions for current month
    const thisMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    // Calculate total expenses for current month
    const totalThisMonth = thisMonthTransactions.reduce((sum, t) => sum + t.amount, 0)

    // Find top category for this month
    const categoryTotals: Record<string, number> = {}
    thisMonthTransactions.forEach(t => {
      if (t.category) {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      }
    })

    let topCategory = { id: '', name: 'None', amount: 0 }
    Object.entries(categoryTotals).forEach(([categoryId, amount]) => {
      if (amount > topCategory.amount) {
        const category = getCategoryById(categoryId)
        topCategory = { id: categoryId, name: category.name, amount }
      }
    })

    // Calculate total all time
    const totalAllTime = transactions.reduce((sum, t) => sum + t.amount, 0)

    return {
      totalThisMonth,
      topCategory,
      totalAllTime,
      transactionCount: transactions.length
    }
  }, [transactions, currentMonth, currentYear])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalThisMonth.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            For {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Spending Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.topCategory.name}</div>
          <p className="text-xs text-muted-foreground">
            ${stats.topCategory.amount.toFixed(2)} this month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total All Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalAllTime.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Across {stats.transactionCount} transactions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.transactionCount > 0 
              ? (stats.totalAllTime / stats.transactionCount).toFixed(2) 
              : '0.00'}
          </div>
          <p className="text-xs text-muted-foreground">
            Per transaction
          </p>
        </CardContent>
      </Card>
    </div>
  )
}