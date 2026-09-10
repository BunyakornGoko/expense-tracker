'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { PageHeader } from '@/components/page-header'
import { SummaryCards } from '@/components/summary-cards'
import { RecentTransactions } from '@/components/recent-transactions'
import { AddTransactionModal } from '@/components/add-transaction-modal'
import {
  categories,
  getAvailableMonths,
  getMonthKey,
  getPreviousMonthKey,
  getTodayKey,
  percentChange,
  sumByType,
  type Transaction,
} from '@/lib/transactions'
import type { PublicUser } from '@/lib/users'
import { apiDelete, apiPatch, apiPost } from '@/lib/api-client'

type DashboardProps = {
  user: PublicUser
  initialTransactions: Transaction[]
}

export function Dashboard({ user, initialTransactions }: DashboardProps) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [activeMonth, setActiveMonth] = useState(getMonthKey(getTodayKey()))
  const [formTarget, setFormTarget] = useState<Transaction | 'new' | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const slip = params.get('slip')
    if (!slip) return
    const messages: Record<string, string> = {
      saved: 'บันทึกรายการจากสลิปแล้ว',
      failed: 'อ่านสลิปไม่สำเร็จ กรอกรายการเองได้เลย',
      missing: 'ไม่พบรูปสลิปที่แชร์มา',
    }
    setToast(messages[slip] ?? null)
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(id)
  }, [toast])

  const availableMonths = useMemo(() => getAvailableMonths(transactions), [transactions])

  const monthTransactions = useMemo(
    () => transactions.filter((item) => getMonthKey(item.date) === activeMonth),
    [transactions, activeMonth],
  )
  const filteredTransactions = useMemo(
    () => (activeCategory === 'ทั้งหมด' ? monthTransactions : monthTransactions.filter((item) => item.category === activeCategory)),
    [activeCategory, monthTransactions],
  )
  const { income, expense } = sumByType(monthTransactions)
  const balance = income - expense

  const previousMonth = getPreviousMonthKey(activeMonth)
  const previousMonthTransactions = useMemo(
    () => transactions.filter((item) => getMonthKey(item.date) === previousMonth),
    [transactions, previousMonth],
  )
  const { income: previousIncome, expense: previousExpense } = sumByType(previousMonthTransactions)
  const previousBalance = previousIncome - previousExpense
  const incomeChange = percentChange(income, previousIncome)
  const expenseChange = percentChange(expense, previousExpense)
  const balanceChange = percentChange(balance, previousBalance)

  async function saveTransaction(entry: Omit<Transaction, 'id' | 'color'>, id?: string) {
    const result = id
      ? await apiPatch<{ transaction: Transaction }>(`/api/transactions/${id}`, entry)
      : await apiPost<{ transaction: Transaction }>('/api/transactions', entry)
    if (!result.ok) return
    const { transaction } = result.data
    setTransactions((current) => (id ? current.map((item) => (item.id === id ? transaction : item)) : [transaction, ...current]))
    setFormTarget(null)
  }

  async function removeTransaction(id: string) {
    const result = await apiDelete(`/api/transactions/${id}`)
    if (!result.ok) return
    setTransactions((current) => current.filter((item) => item.id !== id))
  }

  // availableMonths is sorted newest-first; activeMonth (defaults to the real current month)
  // may not itself have any transactions, so find neighbors by comparison instead of index
  const olderMonths = availableMonths.filter((month) => month < activeMonth)
  const newerMonths = availableMonths.filter((month) => month > activeMonth)
  const canGoOlder = olderMonths.length > 0
  const canGoNewer = newerMonths.length > 0
  const goOlder = () => canGoOlder && setActiveMonth(olderMonths[0])
  const goNewer = () => canGoNewer && setActiveMonth(newerMonths[newerMonths.length - 1])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="app-shell">
        <Sidebar mobileOpen={mobileMenu} onClose={() => setMobileMenu(false)} userName={user.name} />

        <section className="content-area">
          <Topbar monthKey={activeMonth} onOpenMenu={() => setMobileMenu(true)} />
          <div className="content-inner">
            <PageHeader onAddClick={() => setFormTarget('new')} />
            <SummaryCards
              balance={balance}
              income={income}
              expense={expense}
              balanceChange={balanceChange}
              incomeChange={incomeChange}
              expenseChange={expenseChange}
            />
            <RecentTransactions
              transactions={filteredTransactions}
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              monthKey={activeMonth}
              onPrevMonth={goOlder}
              onNextMonth={goNewer}
              canPrevMonth={canGoOlder}
              canNextMonth={canGoNewer}
              onEdit={setFormTarget}
              onDelete={removeTransaction}
            />
          </div>
        </section>
      </div>

      {formTarget && (
        <AddTransactionModal
          onClose={() => setFormTarget(null)}
          onSave={saveTransaction}
          editing={formTarget === 'new' ? undefined : formTarget}
        />
      )}
      {toast && <div className="toast">{toast}</div>}
    </main>
  )
}
