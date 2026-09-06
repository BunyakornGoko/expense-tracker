'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  LayoutDashboard,
  Menu,
  Plus,
  X,
} from 'lucide-react'

type Transaction = {
  id: number
  title: string
  category: string
  date: string
  amount: number
  type: 'income' | 'expense'
  note: string
  color: string
}

const initialTransactions: Transaction[] = [
  { id: 1, title: 'เงินเดือนประจำเดือน', category: 'เงินเดือน', date: 'วันนี้, 09:30', amount: 32000, type: 'income', note: 'เงินเดือนเดือนมิถุนายน', color: 'mint' },
  { id: 2, title: 'ค่าอาหารกลางวัน', category: 'อาหาร', date: 'วันนี้, 12:45', amount: 180, type: 'expense', note: 'ข้าวหน้าเนื้อร้านโปรด', color: 'peach' },
  { id: 3, title: 'ค่าสมาชิก Netflix', category: 'บันเทิง', date: 'เมื่อวาน, 20:10', amount: 419, type: 'expense', note: 'แพ็กเกจ Standard', color: 'lavender' },
  { id: 4, title: 'ค่าเดินทาง BTS', category: 'เดินทาง', date: 'เมื่อวาน, 08:20', amount: 92, type: 'expense', note: 'ไปทำงาน', color: 'yellow' },
]

const categories = ['ทั้งหมด', 'อาหาร', 'เดินทาง', 'บันเทิง', 'เงินเดือน', 'ช้อปปิ้ง']
const formatMoney = (amount: number) => new Intl.NumberFormat('th-TH').format(amount)

function KuromiMark() {
  return (
    <div className="kuromi-mark" aria-label="Kuromi mascot mark">
      <span className="ear ear-left" />
      <span className="ear ear-right" />
      <span className="skull">✦</span>
    </div>
  )
}

export default function Page() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [showForm, setShowForm] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [form, setForm] = useState({ title: '', amount: '', category: 'อาหาร', date: '2026-06-18', type: 'expense', note: '' })

  const filteredTransactions = useMemo(() => activeCategory === 'ทั้งหมด' ? transactions : transactions.filter((item) => item.category === activeCategory), [activeCategory, transactions])
  const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0)
  const expense = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const balance = income - expense

  function addTransaction(event: React.FormEvent) {
    event.preventDefault()
    if (!form.title || !form.amount) return
    setTransactions((current) => [{ id: Date.now(), title: form.title, amount: Number(form.amount), category: form.category, date: 'วันนี้, ตอนนี้', type: form.type as 'income' | 'expense', note: form.note, color: form.type === 'income' ? 'mint' : 'peach' }, ...current])
    setForm({ title: '', amount: '', category: 'อาหาร', date: '2026-06-18', type: 'expense', note: '' })
    setShowForm(false)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="app-shell">
        <aside className={mobileMenu ? 'sidebar mobile-open' : 'sidebar'}>
          <div className="brand-row">
            <KuromiMark />
            <div><p className="brand-name">KUROMI</p><p className="brand-sub">MONEY DIARY</p></div>
            <button className="icon-button close-menu" onClick={() => setMobileMenu(false)} aria-label="ปิดเมนู"><X size={18} /></button>
          </div>
          <nav className="side-nav" aria-label="เมนูหลัก">
            <p className="nav-label">เมนูหลัก</p>
            <div className="nav-item active"><LayoutDashboard size={18} /> ภาพรวม <span className="active-dot" /></div>

          </nav>
        </aside>

        <section className="content-area">
          <header className="topbar"><button className="icon-button menu-toggle" onClick={() => setMobileMenu(true)} aria-label="เปิดเมนู"><Menu size={22} /></button><div className="breadcrumb">ภาพรวม <span>/</span> มิถุนายน 2026</div></header>
          <div className="content-inner">
            <div className="page-heading"><div><p className="eyebrow">THURSDAY, JUNE 18, 2026</p><h1>ภาพรวมการเงิน <span>ของฉัน</span></h1><p className="heading-copy">ติดตามทุกการใช้จ่าย ให้ชีวิตง่ายขึ้นนิดนึง</p></div><button className="primary-button" onClick={() => setShowForm(true)}><Plus size={19} /> เพิ่มรายการ</button></div>
            <section className="summary-grid" aria-label="สรุปการเงิน">
              <div className="balance-card"><div className="card-top"><span className="card-label">ยอดคงเหลือทั้งหมด</span><CircleDollarSign size={20} /></div><div className="balance-amount">฿{formatMoney(balance)}</div><div className="balance-bottom"><span className="trend">↗ 12.5%</span><span>จากเดือนที่แล้ว</span></div><div className="card-sparkles">✦</div></div>
              <div className="stat-card income-card"><div className="stat-icon"><ArrowDownLeft size={20} /></div><p className="card-label">รายรับเดือนนี้</p><div className="stat-amount">฿{formatMoney(income)}</div><p className="stat-note">↑ เพิ่มขึ้น 8.2% จากเดือนที่แล้ว</p></div>
              <div className="stat-card expense-card"><div className="stat-icon"><ArrowUpRight size={20} /></div><p className="card-label">รายจ่ายเดือนนี้</p><div className="stat-amount">฿{formatMoney(expense)}</div><p className="stat-note">↓ ลดลง 4.5% จากเดือนที่แล้ว</p></div>
            </section>
            <div className="section-head"><div><h2>รายการล่าสุด</h2><p>ดูรายการเงินเข้าออกของคุณ</p></div></div>
            <div className="filter-row">{categories.map((category) => <button key={category} className={activeCategory === category ? 'filter active-filter' : 'filter'} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
            <section className="transactions-card">{filteredTransactions.length ? filteredTransactions.map((item) => <article className="transaction" key={item.id}><div className={`transaction-icon ${item.color}`}>{item.type === 'income' ? <ArrowDownLeft size={19} /> : <ArrowUpRight size={19} />}</div><div className="transaction-info"><strong>{item.title}</strong><span>{item.category} · {item.date}</span></div><div className="transaction-note">{item.note}</div><strong className={item.type === 'income' ? 'amount income-text' : 'amount'}>{item.type === 'income' ? '+' : '-'}฿{formatMoney(item.amount)}</strong></article>) : <div className="empty-state">ยังไม่มีรายก���รในหมวดนี้</div>}</section>
          </div>
        </section>
      </div>

      {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false) }}><form className="add-modal" onSubmit={addTransaction}><div className="modal-head"><div><p className="eyebrow">NEW ENTRY</p><h2>เพิ่มรายการใหม่</h2></div><button type="button" className="icon-button" onClick={() => setShowForm(false)} aria-label="ปิด"><X size={19} /></button></div><div className="type-switch"><button type="button" className={form.type === 'expense' ? 'selected' : ''} onClick={() => setForm({ ...form, type: 'expense' })}>รายจ่าย</button><button type="button" className={form.type === 'income' ? 'selected income-selected' : ''} onClick={() => setForm({ ...form, type: 'income' })}>รายรับ</button></div><label>ชื่อรายการ<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="เช่น ค่าอาหารกลางวัน" required /></label><div className="form-row"><label>จำนวนเงิน<input type="number" min="1" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="0.00" required /></label><label>หมวดหมู่<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label></div><label>วันที่<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label>โน้ตเพิ่มเติม<textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="รายละเอียดเล็กๆ น้อยๆ..." rows={3} /></label><button className="primary-button full-button" type="submit"><Plus size={18} /> บันทึกรายการ</button></form></div>}
    </main>
  )
}
