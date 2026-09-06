import { CategoryFilter } from './category-filter'
import { MonthNav } from './month-nav'
import { TransactionList } from './transaction-list'
import type { Transaction } from '@/lib/transactions'

type RecentTransactionsProps = {
  transactions: Transaction[]
  categories: string[]
  activeCategory: string
  onSelectCategory: (category: string) => void
  monthKey: string
  onPrevMonth: () => void
  onNextMonth: () => void
  canPrevMonth: boolean
  canNextMonth: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function RecentTransactions({
  transactions,
  categories,
  activeCategory,
  onSelectCategory,
  monthKey,
  onPrevMonth,
  onNextMonth,
  canPrevMonth,
  canNextMonth,
  onEdit,
  onDelete,
}: RecentTransactionsProps) {
  return (
    <>
      <div className="section-head">
        <div>
          <h2>รายการล่าสุด</h2>
          <p>ดูรายการเงินเข้าออกของคุณ</p>
        </div>
        <MonthNav monthKey={monthKey} onPrev={onPrevMonth} onNext={onNextMonth} canPrev={canPrevMonth} canNext={canNextMonth} />
      </div>
      <CategoryFilter categories={categories} active={activeCategory} onSelect={onSelectCategory} />
      <TransactionList transactions={transactions} onEdit={onEdit} onDelete={onDelete} />
    </>
  )
}
