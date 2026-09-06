import { CategoryFilter } from './category-filter'
import { TransactionList } from './transaction-list'
import type { Transaction } from '@/lib/transactions'

type RecentTransactionsProps = {
  transactions: Transaction[]
  categories: string[]
  activeCategory: string
  onSelectCategory: (category: string) => void
}

export function RecentTransactions({ transactions, categories, activeCategory, onSelectCategory }: RecentTransactionsProps) {
  return (
    <>
      <div className="section-head">
        <div>
          <h2>รายการล่าสุด</h2>
          <p>ดูรายการเงินเข้าออกของคุณ</p>
        </div>
      </div>
      <CategoryFilter categories={categories} active={activeCategory} onSelect={onSelectCategory} />
      <TransactionList transactions={transactions} />
    </>
  )
}
