import { Dashboard } from '@/components/dashboard'
import { getSession } from '@/lib/auth-cookies'
import { getTransactions } from '@/lib/transactions-store'

export default async function Page() {
  const user = await getSession() // guaranteed by middleware
  const transactions = await getTransactions(user!.id)
  return <Dashboard user={user!} initialTransactions={transactions} />
}
