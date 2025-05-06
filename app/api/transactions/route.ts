import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance-visualizer");
    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray();
    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("finance-visualizer");
    const transaction = await request.json();

    const result = await db.collection("transactions").insertOne(transaction);

    return NextResponse.json({ 
      message: "Transaction created successfully",
      transaction: { ...transaction, _id: result.insertedId } // Return the full transaction object
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
