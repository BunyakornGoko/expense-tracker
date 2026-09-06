import { ReactNode } from 'react'
import { ArrowDownLeft, ArrowUpRight, CircleDollarSign } from 'lucide-react'
import { formatMoney } from '@/lib/transactions'

type SummaryCardsProps = {
  balance: number
  income: number
  expense: number
}

export function SummaryCards({ balance, income, expense }: SummaryCardsProps) {
  return (
    <section className="summary-grid" aria-label="สรุปการเงิน">
      <div className="balance-card">
        <div className="card-top">
          <span className="card-label">ยอดคงเหลือทั้งหมด</span>
          <CircleDollarSign size={20} />
        </div>
        <div className="balance-amount">฿{formatMoney(balance)}</div>
        <div className="balance-bottom">
          <span className="trend">↗ 12.5%</span>
          <span>จากเดือนที่แล้ว</span>
        </div>
        <div className="card-sparkles">✦</div>
      </div>
      <StatCard
        className="income-card"
        icon={<ArrowDownLeft size={20} />}
        label="รายรับเดือนนี้"
        amount={income}
        note="↑ เพิ่มขึ้น 8.2% จากเดือนที่แล้ว"
      />
      <StatCard
        className="expense-card"
        icon={<ArrowUpRight size={20} />}
        label="รายจ่ายเดือนนี้"
        amount={expense}
        note="↓ ลดลง 4.5% จากเดือนที่แล้ว"
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
