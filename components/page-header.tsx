import { Plus } from 'lucide-react'

type PageHeaderProps = {
  onAddClick: () => void
}

export function PageHeader({ onAddClick }: PageHeaderProps) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">THURSDAY, JUNE 18, 2026</p>
        <h1>ภาพรวมการเงิน <span>ของฉัน</span></h1>
        <p className="heading-copy">ติดตามทุกการใช้จ่าย ให้ชีวิตง่ายขึ้นนิดนึง</p>
      </div>
      <button className="primary-button" onClick={onAddClick}>
        <Plus size={19} /> เพิ่มรายการ
      </button>
    </div>
  )
}
