
import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'trackit'; // You can change this to your desired database name

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri!);

  console.log('Connecting to database...');
  await client.connect();
  console.log('Connected to database successfully.');

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
