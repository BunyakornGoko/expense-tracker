import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { categories, combineDateWithCurrentTime, formatDateFieldLabel, getDayKey, getTodayKey, type Transaction } from '@/lib/transactions'

type AddTransactionModalProps = {
  onClose: () => void
  onSave: (entry: Omit<Transaction, 'id' | 'color'>, id?: string) => void
  editing?: Transaction
}

export function AddTransactionModal({ onClose, onSave, editing }: AddTransactionModalProps) {
  const [form, setForm] = useState(() =>
    editing
      ? { title: editing.title, amount: String(editing.amount), category: editing.category, date: getDayKey(editing.date), type: editing.type, note: editing.note }
      : { title: '', amount: '', category: 'อาหาร', date: getTodayKey(), type: 'expense' as Transaction['type'], note: '' },
  )

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!form.title || !form.amount) return
    // keep the original time-of-day on edit, only the date input changes the day
    const date =
      editing && getDayKey(editing.date) === form.date ? editing.date : combineDateWithCurrentTime(form.date)
    onSave({ title: form.title, amount: Number(form.amount), category: form.category, date, type: form.type, note: form.note }, editing?.id)
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <form className="add-modal" onSubmit={handleSubmit}>
        <div className="modal-head">
          <div>
            <p className="eyebrow">{editing ? 'EDIT ENTRY' : 'NEW ENTRY'}</p>
            <h2>{editing ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="ปิด">
            <X size={19} />
          </button>
        </div>
        <div className="type-switch">
          <button type="button" className={form.type === 'expense' ? 'selected' : ''} onClick={() => setForm({ ...form, type: 'expense' })}>
            รายจ่าย
          </button>
          <button type="button" className={form.type === 'income' ? 'selected income-selected' : ''} onClick={() => setForm({ ...form, type: 'income' })}>
            รายรับ
          </button>
        </div>
        <label>
          ชื่อรายการ
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="เช่น ค่าอาหารกลางวัน" required />
        </label>
        <div className="form-row">
          <label>
            จำนวนเงิน
            <input type="number" min="1" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="0.00" required />
          </label>
          <label>
            หมวดหมู่
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.slice(1).map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          วันที่
          <div className="date-field">
            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
            <span className="date-display">{formatDateFieldLabel(form.date)}</span>
          </div>
        </label>
        <label>
          โน้ตเพิ่มเติม
          <textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="รายละเอียดเล็กๆ น้อยๆ..." rows={3} />
        </label>
        <button className="primary-button full-button" type="submit">
          <Plus size={18} /> {editing ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}
        </button>
      </form>
    </div>
  )
}
