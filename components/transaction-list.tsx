import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react'
import { formatDayLabel, formatMoney, formatTime, groupByDay, type Transaction } from '@/lib/transactions'
import { ConfirmDialog } from './confirm-dialog'

type TransactionListProps = {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null)

  if (!transactions.length) {
    return (
      <section className="transactions-card">
        <div className="empty-state">
          <img src="/Kuromi%20Sticker%20Collection.png" alt="" aria-hidden="true" />
          <span>ยังไม่มีรายการในหมวดนี้</span>
        </div>
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
              <TransactionItem key={item.id} transaction={item} onEdit={onEdit} onRequestDelete={setPendingDelete} />
            ))}
          </div>
        </section>
      ))}

      {pendingDelete && (
        <ConfirmDialog
          title="ลบรายการ"
          message={`ลบ "${pendingDelete.title}" ใช่ไหม? การลบไม่สามารถย้อนกลับได้`}
          confirmLabel="ลบรายการ"
          onConfirm={() => {
            onDelete(pendingDelete.id)
            setPendingDelete(null)
          }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  )
}

type TransactionItemProps = {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onRequestDelete: (transaction: Transaction) => void
}

function TransactionItem({ transaction, onEdit, onRequestDelete }: TransactionItemProps) {
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
      <div className="transaction-actions">
        <button className="icon-button" onClick={() => onEdit(transaction)} aria-label="แก้ไขรายการ">
          <Pencil size={15} />
        </button>
        <button className="icon-button" onClick={() => onRequestDelete(transaction)} aria-label="ลบรายการ">
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  )
}
