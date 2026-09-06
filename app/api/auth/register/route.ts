import { NextResponse } from 'next/server'
import { createUser } from '@/lib/users'
import { setSessionCookie } from '@/lib/auth-cookies'

export async function POST(request: Request) {
  const { email, password, name } = await request.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'กรอกข้อมูลให้ครบ' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' }, { status: 400 })
  }

  try {
    const user = await createUser(email, password, name)
    await setSessionCookie(user)
    return NextResponse.json({ user })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'สมัครสมาชิกไม่สำเร็จ'
    return NextResponse.json({ error: message }, { status: 409 })
  }
}
