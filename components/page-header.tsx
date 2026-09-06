import { Plus } from 'lucide-react'
import { formatFullDateLabel, getTodayKey } from '@/lib/transactions'

type PageHeaderProps = {
  onAddClick: () => void
}

export function PageHeader({ onAddClick }: PageHeaderProps) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{formatFullDateLabel(getTodayKey())}</p>
        <h1>ภาพรวมการเงิน <span>ของฉัน</span></h1>
        <p className="heading-copy">ติดตามทุกการใช้จ่าย ให้ชีวิตง่ายขึ้นนิดนึง</p>
      </div>
      <button className="primary-button" onClick={onAddClick}>
        <Plus size={19} /> เพิ่มรายการ
      </button>
    </div>
  )
}
