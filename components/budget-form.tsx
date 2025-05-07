"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categories } from "@/lib/categories"

interface BudgetFormProps {
  onSubmit: (budget: { category: string; amount: number }) => void
  onCancel: () => void
}

export default function BudgetForm({ onSubmit, onCancel }: BudgetFormProps) {
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!category || !amount) {
      setError("Please fill in all fields")
      return
    }

    const budgetAmount = parseFloat(amount)
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    onSubmit({
      category,
      amount: budgetAmount
    })
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Input
                id="amount"
                type="number"
                placeholder="Monthly Budget Amount ($)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Set Budget</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
