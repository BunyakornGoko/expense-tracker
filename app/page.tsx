'use client'

import { useMemo, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { PageHeader } from '@/components/page-header'
import { SummaryCards } from '@/components/summary-cards'
import { RecentTransactions } from '@/components/recent-transactions'
import { AddTransactionModal } from '@/components/add-transaction-modal'
import { categories, getAvailableMonths, getMonthKey, getTodayKey, initialTransactions, type Transaction } from '@/lib/transactions'

export default function Page() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [activeMonth, setActiveMonth] = useState(getMonthKey(getTodayKey()))
  const [showForm, setShowForm] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const availableMonths = useMemo(() => getAvailableMonths(transactions), [transactions])

  const monthTransactions = useMemo(
    () => transactions.filter((item) => getMonthKey(item.date) === activeMonth),
    [transactions, activeMonth],
  )
  const filteredTransactions = useMemo(
    () => (activeCategory === 'ทั้งหมด' ? monthTransactions : monthTransactions.filter((item) => item.category === activeCategory)),
    [activeCategory, monthTransactions],
  )
  const income = monthTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0)
  const expense = monthTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const balance = income - expense

  function addTransaction(entry: Omit<Transaction, 'id' | 'color'>) {
    setTransactions((current) => [{ id: Date.now(), color: entry.type === 'income' ? 'mint' : 'peach', ...entry }, ...current])
    setShowForm(false)
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
        <Sidebar mobileOpen={mobileMenu} onClose={() => setMobileMenu(false)} />

        <section className="content-area">
          <Topbar monthKey={activeMonth} onOpenMenu={() => setMobileMenu(true)} />
          <div className="content-inner">
            <PageHeader onAddClick={() => setShowForm(true)} />
            <SummaryCards balance={balance} income={income} expense={expense} />
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
            />
          </div>
        </section>
      </div>

      {showForm && <AddTransactionModal onClose={() => setShowForm(false)} onAdd={addTransaction} />}
    </main>
  )
}
