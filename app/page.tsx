"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import TransactionForm from "@/components/transaction-form"
import TransactionList from "@/components/transaction-list"
import ExpensesChart from "@/components/expenses-chart"
import CategoryPieChart from "@/components/category-pie-chart"
import DashboardSummary from "@/components/dashboard-summary"
import BudgetForm from "@/components/budget-form"
import BudgetComparisonChart from "@/components/budget-comparison-chart"
import SpendingInsights from "@/components/spending-insights"
import type { Transaction, Budget } from "@/lib/types"

// Add Framer Motion
import { motion } from "framer-motion"

// Import Google Fonts (Inter and Rubik)
import "@fontsource/inter"
import "@fontsource/rubik"

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false)

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

  const handleBudgetSubmit = async (budget: Budget) => {
    try {
      const updatedBudgets = [...budgets]
      const existingIndex = updatedBudgets.findIndex(b => b.category === budget.category)
      
      if (existingIndex >= 0) {
        updatedBudgets[existingIndex] = budget
      } else {
        updatedBudgets.push(budget)
      }
      
      setBudgets(updatedBudgets)
      setIsBudgetFormOpen(false)
    } catch (error) {
      console.error('Error saving budget:', error)
    }
  }

  // Calculate total spent for header
  const totalSpent = transactions.reduce((sum, t) => sum + (typeof t.amount === "number" ? t.amount : 0), 0)

  return (
    <div className="min-h-screen bg-[#f6f9fc] font-inter">
      {/* Animated Gradient Header */}
      <motion.div
        className="w-[98vw] max-w-[1700px] mx-auto mt-8 mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.div
          className="rounded-2xl shadow-lg px-14 py-6 min-h-[80px] flex items-center animate-fade-in"
          style={{
            background: "linear-gradient(120deg, #ff6a00, #ee0979, #23a6d5, #6d8ce3, #43e97b, #38f9d7)",
            backgroundSize: "200% 200%",
            animation: "gradientMove 6s ease-in-out infinite"
          }}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1 drop-shadow-lg font-rubik tracking-tight">
              Finance Tracker
            </h1>
            {/* Optionally add a subtitle or date here */}
          </div>
          <div className="text-right">
            <div className="text-white/90 text-base font-medium mb-1 drop-shadow font-inter">
              Total Spent
            </div>
            <div className="text-4xl font-extrabold text-white drop-shadow-lg font-rubik">
              ${totalSpent.toFixed(2)}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-24px);}
          to { opacity: 1; transform: translateY(0);}
        }
        /* Google Fonts utility classes */
        .font-inter { font-family: 'InterVariable', 'Inter', Arial, sans-serif; }
        .font-rubik { font-family: 'RubikVariable', 'Rubik', Arial, sans-serif; }
      `}</style>

      <main className="max-w-6xl mx-auto px-4">
        {/* Your Finances Section */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-xl font-semibold text-gray-800 font-rubik">Your Finances</h2>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button variant="outline" className="bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 font-inter" onClick={() => setIsBudgetFormOpen(true)}>
              Set Budget
            </Button>
            <Button className="bg-gray-900 text-white hover:bg-gray-800 font-inter" onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        >
          {/* Budget vs. Actual Chart */}
          <Card className="col-span-2 rounded-xl shadow-sm font-inter">
            <CardHeader className="pb-2">
              <CardTitle className="font-rubik">Budget vs. Actual Spending - May 2025</CardTitle>
            </CardHeader>
            <CardContent className="h-[260px]">
              <BudgetComparisonChart transactions={transactions} budgets={budgets} />
            </CardContent>
          </Card>
          {/* Spending Insights */}
          <div>
            <SpendingInsights transactions={transactions} budgets={budgets} />
          </div>
        </motion.div>

        {/* Monthly Expenses Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
        >
          <Card className="mb-8 rounded-xl shadow-sm font-inter">
            <CardHeader className="pb-2">
              <CardTitle className="font-rubik">Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent className="h-[220px] overflow-x-auto">
              <div className="min-w-[320px] w-full h-full">
                <ExpensesChart transactions={transactions} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
        >
          <Card className="rounded-xl shadow-sm font-inter">
            <CardHeader className="pb-2">
              <CardTitle className="font-rubik">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <TransactionList transactions={transactions} onEdit={openEditForm} onDelete={handleDeleteTransaction} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Modals */}
        {isBudgetFormOpen && (
          <BudgetForm
            onSubmit={handleBudgetSubmit}
            onCancel={() => setIsBudgetFormOpen(false)}
          />
        )}
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
    </div>
  )
}
