import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/mongodb'
import type { Transaction } from '@/lib/transactions'

type TransactionDoc = Omit<Transaction, 'id'> & { userId: string }

let indexEnsured = false

async function transactionsCollection() {
  const db = await getDb()
  const collection = db.collection<TransactionDoc>('transactions')
  if (!indexEnsured) {
    await collection.createIndex({ userId: 1 })
    indexEnsured = true
  }
  return collection
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const collection = await transactionsCollection()
  const docs = await collection.find({ userId }).sort({ date: -1 }).toArray()
  return docs.map(({ _id, userId: _userId, ...rest }) => ({ id: _id.toString(), ...rest }))
}

export async function addTransaction(userId: string, entry: Omit<Transaction, 'id' | 'color'>): Promise<Transaction> {
  const collection = await transactionsCollection()
  const color = entry.type === 'income' ? 'mint' : 'peach'
  const result = await collection.insertOne({ ...entry, color, userId })
  return { id: result.insertedId.toString(), ...entry, color }
}

export async function updateTransaction(
  userId: string,
  id: string,
  entry: Omit<Transaction, 'id' | 'color'>,
): Promise<Transaction | null> {
  if (!ObjectId.isValid(id)) return null
  const collection = await transactionsCollection()
  const color = entry.type === 'income' ? 'mint' : 'peach'
  const updated = await collection.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: { ...entry, color } },
    { returnDocument: 'after' },
  )
  if (!updated) return null
  const { _id, userId: _userId, ...rest } = updated
  return { id: _id.toString(), ...rest }
}

export async function deleteTransaction(userId: string, id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const collection = await transactionsCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id), userId })
  return result.deletedCount > 0
}
