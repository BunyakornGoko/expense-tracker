import { SignJWT, jwtVerify } from 'jose'
import type { PublicUser } from '@/lib/users'

export const SESSION_COOKIE = 'session'
export const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days

function getSecretKey() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET env var is not set')
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(user: PublicUser): Promise<string> {
  return new SignJWT({ id: user.id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string): Promise<PublicUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return { id: payload.id as string, email: payload.email as string, name: payload.name as string }
  } catch {
    return null
  }
}
