import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatDayLabel, formatMoney, formatTime, groupByDay, type Transaction } from '@/lib/transactions'

type TransactionListProps = {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (!transactions.length) {
    return (
      <section className="transactions-card">
        <div className="empty-state">ยังไม่มีรายการในหมวดนี้</div>
      </section>
    )
  }

  const dayGroups = groupByDay(transactions)

  return (
    <>
      {dayGroups.map((group) => (
        <section className="day-group" key={group.dayKey}>
          <div className="day-head">
            <span className="day-label">{formatDayLabel(group.dayKey)}</span>
            <span className="day-summary">
              {group.income > 0 && <span className="day-income">+฿{formatMoney(group.income)}</span>}
              {group.expense > 0 && <span className="day-expense">-฿{formatMoney(group.expense)}</span>}
            </span>
          </div>
          <div className="transactions-card">
            {group.transactions.map((item) => (
              <TransactionItem key={item.id} transaction={item} />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === 'income'
  return (
    <article className="transaction">
      <div className={`transaction-icon ${transaction.color}`}>
        {isIncome ? <ArrowDownLeft size={19} /> : <ArrowUpRight size={19} />}
      </div>
      <div className="transaction-info">
        <strong>{transaction.title}</strong>
        <span>{transaction.category} · {formatTime(transaction.date)}</span>
      </div>
      <div className="transaction-note">{transaction.note}</div>
      <strong className={isIncome ? 'amount income-text' : 'amount'}>
        {isIncome ? '+' : '-'}฿{formatMoney(transaction.amount)}
      </strong>
    </article>
  )
}
