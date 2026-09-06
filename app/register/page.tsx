import { RegisterForm } from '@/components/register-form'
import { KuromiMark } from '@/components/kuromi-mark'

export default function RegisterPage() {
  return (
    <main className="auth-shell">
      <KuromiMark />
      <RegisterForm />
    </main>
  )
}
