'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    setLoading(false)
    if (!res.ok) {
      const { error } = await res.json()
      setError(error)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <p className="eyebrow">WELCOME BACK</p>
      <h2>เข้าสู่ระบบ</h2>
      {error && <p className="auth-error">{error}</p>}
      <label>
        อีเมล
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label>
        รหัสผ่าน
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      <button className="primary-button full-button" type="submit" disabled={loading}>
        <LogIn size={18} /> เข้าสู่ระบบ
      </button>
      <p className="auth-switch">
        ยังไม่มีบัญชี? <a href="/register">สมัครสมาชิก</a>
      </p>
    </form>
  )
}
