import { cookies } from 'next/headers'
import type { PublicUser } from '@/lib/users'
import { createSessionToken, SESSION_COOKIE, SESSION_DURATION, verifySessionToken } from '@/lib/session'

export async function setSessionCookie(user: PublicUser) {
  const token = await createSessionToken(user)
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<PublicUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}
