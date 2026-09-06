import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatMoney, type Transaction } from '@/lib/transactions'

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

  return (
    <section className="transactions-card">
      {transactions.map((item) => (
        <TransactionItem key={item.id} transaction={item} />
      ))}
    </section>
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
        <span>{transaction.category} · {transaction.date}</span>
      </div>
      <div className="transaction-note">{transaction.note}</div>
      <strong className={isIncome ? 'amount income-text' : 'amount'}>
        {isIncome ? '+' : '-'}฿{formatMoney(transaction.amount)}
      </strong>
    </article>
  )
}
