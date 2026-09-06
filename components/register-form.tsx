'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import { apiPost } from '@/lib/api-client'

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const result = await apiPost('/api/auth/register', { name, email, password })
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <p className="eyebrow">NEW ACCOUNT</p>
      <h2>สมัครสมาชิก</h2>
      {error && <p className="auth-error">{error}</p>}
      <label>
        ชื่อ
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        อีเมล
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label>
        รหัสผ่าน
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
      </label>
      <button className="primary-button full-button" type="submit" disabled={loading}>
        <UserPlus size={18} /> {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
      </button>
      <p className="auth-switch">
        มีบัญชีแล้ว? <a href="/login">เข้าสู่ระบบ</a>
      </p>
    </form>
  )
}
