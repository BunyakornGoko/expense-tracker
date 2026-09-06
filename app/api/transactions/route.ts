import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-cookies'
import { addTransaction, getTransactions } from '@/lib/transactions-store'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const transactions = await getTransactions(user.id)
  return NextResponse.json({ transactions })
}

export async function POST(request: Request) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, amount, category, date, type, note } = await request.json()
  if (!title || !amount || !category || !date || !type) {
    return NextResponse.json({ error: 'กรอกข้อมูลให้ครบ' }, { status: 400 })
  }

  const transaction = await addTransaction(user.id, { title, amount, category, date, type, note: note ?? '' })
  return NextResponse.json({ transaction })
}
