import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { categories, combineDateWithCurrentTime, getTodayKey, type Transaction } from '@/lib/transactions'

type AddTransactionModalProps = {
  onClose: () => void
  onAdd: (transaction: Omit<Transaction, 'id' | 'color'>) => void
}

export function AddTransactionModal({ onClose, onAdd }: AddTransactionModalProps) {
  const [form, setForm] = useState(() => ({ title: '', amount: '', category: 'อาหาร', date: getTodayKey(), type: 'expense' as Transaction['type'], note: '' }))

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!form.title || !form.amount) return
    onAdd({ title: form.title, amount: Number(form.amount), category: form.category, date: combineDateWithCurrentTime(form.date), type: form.type, note: form.note })
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
            <p className="eyebrow">NEW ENTRY</p>
            <h2>เพิ่มรายการใหม่</h2>
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
          <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
        </label>
        <label>
          โน้ตเพิ่มเติม
          <textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="รายละเอียดเล็กๆ น้อยๆ..." rows={3} />
        </label>
        <button className="primary-button full-button" type="submit">
          <Plus size={18} /> บันทึกรายการ
        </button>
      </form>
    </div>
  )
}
