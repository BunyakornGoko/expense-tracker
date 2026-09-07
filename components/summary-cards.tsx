import { ReactNode } from 'react'
import { ArrowDownLeft, ArrowUpRight, CircleDollarSign } from 'lucide-react'
import { formatChangeNote, formatMoney, formatTrendChip } from '@/lib/transactions'

type SummaryCardsProps = {
  balance: number
  income: number
  expense: number
  balanceChange: number | null
  incomeChange: number | null
  expenseChange: number | null
}

export function SummaryCards({ balance, income, expense, balanceChange, incomeChange, expenseChange }: SummaryCardsProps) {
  return (
    <section className="summary-grid" aria-label="สรุปการเงิน">
      <div className="balance-card">
        <div className="card-top">
          <span className="card-label">ยอดคงเหลือทั้งหมด</span>
          <CircleDollarSign size={20} />
        </div>
        <div className="balance-amount">฿{formatMoney(balance)}</div>
        <div className="balance-bottom">
          <span className="trend">{formatTrendChip(balanceChange)}</span>
          <span>จากเดือนที่แล้ว</span>
        </div>
        <div className="card-sparkles">
          <img src="/Kuromi.png" alt="" aria-hidden="true" />
        </div>
      </div>
      <StatCard
        className="income-card"
        icon={<ArrowDownLeft size={20} />}
        label="รายรับเดือนนี้"
        amount={income}
        note={formatChangeNote(incomeChange)}
      />
      <StatCard
        className="expense-card"
        icon={<ArrowUpRight size={20} />}
        label="รายจ่ายเดือนนี้"
        amount={expense}
        note={formatChangeNote(expenseChange)}
      />
    </section>
  )
}

type StatCardProps = {
  className: string
  icon: ReactNode
  label: string
  amount: number
  note: string
}

function StatCard({ className, icon, label, amount, note }: StatCardProps) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon">{icon}</div>
      <p className="card-label">{label}</p>
      <div className="stat-amount">฿{formatMoney(amount)}</div>
      <p className="stat-note">{note}</p>
    </div>
  )
}
