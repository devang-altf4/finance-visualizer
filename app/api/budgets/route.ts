import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import mongoose from 'mongoose'

// Define Budget schema/model if not already defined elsewhere
const BudgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
}, { timestamps: true })

const Budget = mongoose.models.Budget || mongoose.model('Budget', BudgetSchema)

export async function GET() {
  await connectDB()
  const budgets = await Budget.find().lean()
  return NextResponse.json({ budgets })
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  // Upsert by category
  await Budget.findOneAndUpdate(
    { category: body.category },
    { $set: { amount: body.amount } },
    { upsert: true, new: true }
  )
  const budgets = await Budget.find().lean()
  return NextResponse.json({ budgets })
}
