"use client"

import { Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Transaction } from "@/lib/types"

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="h-full overflow-y-auto">
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
          <p className="text-sm text-muted-foreground">
            No transactions yet. Add your first transaction to get started.
          </p>
        </div>
      ) : (
        <div className="w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="min-w-[120px]">Description</TableHead>
                <TableHead className="text-right w-[100px]">Amount</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id || Math.random().toString()}>
                  <TableCell className="whitespace-nowrap">
                    {transaction.date && !isNaN(new Date(transaction.date).getTime())
                      ? format(new Date(transaction.date), "MMM d, yyyy")
                      : "Invalid Date"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    ${transaction.amount !== undefined && transaction.amount !== null
                      ? parseFloat(transaction.amount.toString()).toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(transaction)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDelete(transaction.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
