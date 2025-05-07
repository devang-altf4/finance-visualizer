"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TransactionForm from "@/components/transaction-form"
import TransactionList from "@/components/transaction-list"
import ExpensesChart from "@/components/expenses-chart"
import CategoryPieChart from "@/components/category-pie-chart"
import DashboardSummary from "@/components/dashboard-summary"
import type { Transaction } from "@/lib/types"

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions')
        const data = await response.json()
        const sanitizedTransactions = data.transactions.map((t: Transaction) => ({
          ...t,
          date: t.date && !isNaN(new Date(t.date).getTime()) ? new Date(t.date) : null, // Ensure valid date or null
          amount: t.amount !== undefined && t.amount !== null ? parseFloat(t.amount.toString()) : 0, // Ensure valid amount
        }))
        setTransactions(sanitizedTransactions)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }

    fetchTransactions()
  }, [])

  const handleTransactionSubmit = (transaction: Transaction) => {
    const sanitizedTransaction = {
      ...transaction,
      date: transaction.date && !isNaN(new Date(transaction.date).getTime()) ? new Date(transaction.date) : new Date(), // Ensure valid date
      amount: transaction.amount !== undefined && transaction.amount !== null ? parseFloat(transaction.amount.toString()) : 0, // Ensure valid amount
    }

    setTransactions(prev => {
      const index = prev.findIndex(t => t.id === sanitizedTransaction.id)
      if (index >= 0) {
        // Update existing transaction
        const updated = [...prev]
        updated[index] = sanitizedTransaction
        return updated
      }
      // Add new transaction
      return [...prev, sanitizedTransaction]
    })
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  const handleEditTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      })

      if (!response.ok) throw new Error('Failed to update transaction')

      setTransactions(transactions.map((t) => (t.id === transaction.id ? transaction : t)))
      setEditingTransaction(null)
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete transaction')

      setTransactions(transactions.filter((t) => t.id !== id))
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
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

      {/* Dashboard Summary */}
      <div className="mb-6">
        <DashboardSummary transactions={transactions} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Category Breakdown */}
          <Card className="w-full border rounded-lg overflow-hidden">
            <CardHeader className="pb-2 border-b">
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Your expenses by category.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] p-4">
              <CategoryPieChart transactions={transactions} />
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="w-full border rounded-lg overflow-hidden">
          <CardHeader className="pb-2 border-b">
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>View and manage your recent transactions.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] overflow-auto">
            <TransactionList transactions={transactions} onEdit={openEditForm} onDelete={handleDeleteTransaction} />
          </CardContent>
        </Card>
      </div>

      {(isFormOpen || editingTransaction) && (
        <TransactionForm
          onSubmit={handleTransactionSubmit}
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
