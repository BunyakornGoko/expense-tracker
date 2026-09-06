import { LoginForm } from '@/components/login-form'
import { KuromiMark } from '@/components/kuromi-mark'

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <KuromiMark />
      <LoginForm />
    </main>
  )
}
