"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TransactionForm from "@/components/transaction-form"
import TransactionList from "@/components/transaction-list"
import ExpensesChart from "@/components/expenses-chart"
import type { Transaction } from "@/lib/types"

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: 120.5,
      date: new Date("2023-05-01"),
      description: "Grocery shopping",
    },
    {
      id: "2",
      amount: 45.0,
      date: new Date("2023-05-03"),
      description: "Gas station",
    },
    {
      id: "3",
      amount: 200.0,
      date: new Date("2023-05-10"),
      description: "Electricity bill",
    },
    {
      id: "4",
      amount: 35.99,
      date: new Date("2023-05-15"),
      description: "Online subscription",
    },
    {
      id: "5",
      amount: 80.0,
      date: new Date("2023-06-01"),
      description: "Phone bill",
    },
  ])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction])
    setIsFormOpen(false)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactions(transactions.map((t) => (t.id === transaction.id ? transaction : t)))
    setEditingTransaction(null)
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  return (
    <main className="container mx-auto p-4 max-w-[1200px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Finance Tracker</h1>
        <Button onClick={() => setIsFormOpen(true)} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Monthly Expenses Chart */}
        <Card className="w-full border rounded-lg overflow-hidden">
          <CardHeader className="pb-2 border-b">
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Your expenses broken down by month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-4">
            <ExpensesChart transactions={transactions} />
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="w-full border rounded-lg overflow-hidden">
          <CardHeader className="pb-2 border-b">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View and manage your recent transactions.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] overflow-auto">
            <TransactionList transactions={transactions} onEdit={openEditForm} onDelete={handleDeleteTransaction} />
          </CardContent>
        </Card>
      </div>

      {(isFormOpen || editingTransaction) && (
        <TransactionForm
          onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingTransaction(null)
          }}
          transaction={editingTransaction}
        />
      )}
    </main>
  )
}
