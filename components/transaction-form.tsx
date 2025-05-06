"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { Transaction } from "@/lib/types"

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void
  onCancel: () => void
  transaction?: Transaction | null
}

export default function TransactionForm({ onSubmit, onCancel, transaction }: TransactionFormProps) {
  const [amount, setAmount] = useState(transaction?.amount.toString() || "")
  const [date, setDate] = useState<Date | undefined>(transaction?.date || new Date())
  const [description, setDescription] = useState(transaction?.description || "")
  const [errors, setErrors] = useState({
    amount: "",
    date: "",
    description: "",
  })

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString())
      setDate(transaction.date)
      setDescription(transaction.description)
    }
  }, [transaction])

  const validateForm = () => {
    let valid = true
    const newErrors = {
      amount: "",
      date: "",
      description: "",
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
      valid = false
    }

    if (!date) {
      newErrors.date = "Please select a date"
      valid = false
    }

    if (!description.trim()) {
      newErrors.description = "Please enter a description"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const newTransaction: Transaction = {
      id: transaction?.id || uuidv4(),
      amount: Number(amount),
      date: date as Date,
      description,
    }

    onSubmit(newTransaction)
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{transaction ? "Edit Transaction" : "Add Transaction"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{transaction ? "Update" : "Add"} Transaction</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
