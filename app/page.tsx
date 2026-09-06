'use client'

import { useMemo, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { PageHeader } from '@/components/page-header'
import { SummaryCards } from '@/components/summary-cards'
import { RecentTransactions } from '@/components/recent-transactions'
import { AddTransactionModal } from '@/components/add-transaction-modal'
import { categories, initialTransactions, type Transaction } from '@/lib/transactions'

export default function Page() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [showForm, setShowForm] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const filteredTransactions = useMemo(
    () => (activeCategory === 'ทั้งหมด' ? transactions : transactions.filter((item) => item.category === activeCategory)),
    [activeCategory, transactions],
  )
  const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0)
  const expense = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const balance = income - expense

  function addTransaction(entry: Omit<Transaction, 'id' | 'date' | 'color'>) {
    setTransactions((current) => [
      { id: Date.now(), date: 'วันนี้, ตอนนี้', color: entry.type === 'income' ? 'mint' : 'peach', ...entry },
      ...current,
    ])
    setShowForm(false)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="app-shell">
        <Sidebar mobileOpen={mobileMenu} onClose={() => setMobileMenu(false)} />

        <section className="content-area">
          <Topbar onOpenMenu={() => setMobileMenu(true)} />
          <div className="content-inner">
            <PageHeader onAddClick={() => setShowForm(true)} />
            <SummaryCards balance={balance} income={income} expense={expense} />
            <RecentTransactions
              transactions={filteredTransactions}
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>
        </section>
      </div>

      {showForm && <AddTransactionModal onClose={() => setShowForm(false)} onAdd={addTransaction} />}
    </main>
  )
}
