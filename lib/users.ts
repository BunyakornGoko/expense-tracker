import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/mongodb'

export type PublicUser = {
  id: string
  email: string
  name: string
}

type UserDoc = {
  email: string
  name: string
  passwordHash: string
}

let indexEnsured = false

async function usersCollection() {
  const db = await getDb()
  const collection = db.collection<UserDoc>('users')
  if (!indexEnsured) {
    await collection.createIndex({ email: 1 }, { unique: true })
    indexEnsured = true
  }
  return collection
}

export async function createUser(email: string, password: string, name: string): Promise<PublicUser> {
  const users = await usersCollection()
  const normalizedEmail = email.trim().toLowerCase()

  const existing = await users.findOne({ email: normalizedEmail })
  if (existing) throw new Error('มีบัญชีนี้อยู่แล้ว')

  const passwordHash = await bcrypt.hash(password, 10)
  const result = await users.insertOne({ email: normalizedEmail, name, passwordHash })
  return { id: result.insertedId.toString(), email: normalizedEmail, name }
}

export async function verifyCredentials(email: string, password: string): Promise<PublicUser | null> {
  const users = await usersCollection()
  const user = await users.findOne({ email: email.trim().toLowerCase() })
  if (!user) return null

  const valid = await bcrypt.compare(password, user.passwordHash)
  return valid ? { id: user._id.toString(), email: user.email, name: user.name } : null
}
