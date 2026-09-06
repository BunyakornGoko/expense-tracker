import { NextResponse } from 'next/server'
import { verifyCredentials } from '@/lib/users'
import { setSessionCookie } from '@/lib/auth-cookies'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'กรอกข้อมูลให้ครบ' }, { status: 400 })
  }

  const user = await verifyCredentials(email, password)
  if (!user) {
    return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
  }

  await setSessionCookie(user)
  return NextResponse.json({ user })
}
