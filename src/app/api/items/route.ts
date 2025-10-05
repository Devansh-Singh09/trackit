
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ success: false, message: 'Item name is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const itemsCollection = db.collection('items');

    const result = await itemsCollection.insertOne({ name, createdAt: new Date() });

    return NextResponse.json({ success: true, item: { _id: result.insertedId, name } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const itemsCollection = db.collection('items');

    const items = await itemsCollection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
