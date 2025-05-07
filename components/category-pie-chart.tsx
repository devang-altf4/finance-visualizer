"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { categories, getCategoryById } from "@/lib/categories"
import type { Transaction } from "@/lib/types"

interface CategoryPieChartProps {
  transactions: Transaction[]
}

export default function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const chartData = useMemo(() => {
    // Group transactions by category
    const categoryData: Record<string, number> = {}

    // Initialize all categories with zero
    categories.forEach(category => {
      categoryData[category.id] = 0
    })

    // Sum up transaction amounts by category
    transactions.forEach(transaction => {
      if (transaction.category) {
        categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount
      } else {
        categoryData['other'] = (categoryData['other'] || 0) + transaction.amount
      }
    })

    // Convert to array format for chart and filter out zero values
    return Object.entries(categoryData)
      .map(([categoryId, amount]) => ({
        name: getCategoryById(categoryId).name,
        value: amount,
        id: categoryId,
        color: getCategoryById(categoryId).color
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value) // Sort by value descending
  }, [transactions])

  const totalAmount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])

  if (transactions.length === 0 || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <p className="text-sm text-muted-foreground">No transaction data available to display chart.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => {
              return typeof value === 'number' 
                ? [`$${value.toFixed(2)}`, 'Amount'] 
                : [`$${value}`, 'Amount'];
            }}
            labelFormatter={(name) => `${name}`}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            formatter={(value, entry, index) => {
              const { payload } = entry as any;
              const percentage = ((payload.value / totalAmount) * 100).toFixed(0);
              return `${value} (${percentage}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}