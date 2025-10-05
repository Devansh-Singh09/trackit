
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  console.log('Signup API route called');
  try {
    const { username, password } = await request.json();
    console.log('Received signup request with username:', username);

    if (!username || !password) {
      console.log('Username or password not provided');
      return NextResponse.json({ success: false, message: 'Username and password are required' }, { status: 400 });
    }

    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    console.log('Connected to database.');
    const usersCollection = db.collection('users');

    console.log('Checking if user exists...');
    const existingUser = await usersCollection.findOne({ username });
    console.log('Existing user check complete. User found:', existingUser);

    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed.');

    console.log('Inserting new user...');
    const result = await usersCollection.insertOne({ username, password: hashedPassword });
    console.log('User insertion result:', result);

    return NextResponse.json({ success: true, message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('An error occurred in the signup API route:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
