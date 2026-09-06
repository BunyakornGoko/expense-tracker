import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-cookies'
import { deleteTransaction, updateTransaction } from '@/lib/transactions-store'

type RouteParams = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteParams) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { title, amount, category, date, type, note } = await request.json()
  if (!title || !amount || !category || !date || !type) {
    return NextResponse.json({ error: 'กรอกข้อมูลให้ครบ' }, { status: 400 })
  }

  const transaction = await updateTransaction(user.id, id, { title, amount, category, date, type, note: note ?? '' })
  if (!transaction) return NextResponse.json({ error: 'ไม่พบรายการ' }, { status: 404 })
  return NextResponse.json({ transaction })
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const deleted = await deleteTransaction(user.id, id)
  if (!deleted) return NextResponse.json({ error: 'ไม่พบรายการ' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
