
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcrypt';


export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // For demonstration, we'll create a dummy user if the collection is empty
    const userCount = await usersCollection.countDocuments();
    if (userCount === 0) {
      await usersCollection.insertOne({ username: 'admin', password: 'password' });
    }

    const user = await usersCollection.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ success: true, message: 'Login successful' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
