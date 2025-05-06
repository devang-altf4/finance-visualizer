import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")
    const transaction = await request.json()

    await db.collection("transactions").updateOne(
      { id: params.id },
      { $set: transaction }
    )

    return NextResponse.json({ message: "Transaction updated successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    await db.collection("transactions").deleteOne({ id: params.id })

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    )
  }
}
