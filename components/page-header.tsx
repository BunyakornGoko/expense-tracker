import { useRef, useState } from 'react'
import { Plus, ScanLine } from 'lucide-react'
import { formatFullDateLabel, getTodayKey } from '@/lib/transactions'

type PageHeaderProps = {
  onAddClick: () => void
}

export function PageHeader({ onAddClick }: PageHeaderProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)

  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{formatFullDateLabel(getTodayKey())}</p>
        <h1>ภาพรวมการเงิน <span>ของฉัน</span></h1>
        <p className="heading-copy">ติดตามทุกการใช้จ่าย ให้ชีวิตง่ายขึ้นนิดนึง</p>
      </div>
      <div className="header-actions">
        <form ref={formRef} action="/share-slip" method="POST" encType="multipart/form-data">
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={(event) => {
              if (!event.target.files?.[0]) return
              setImporting(true)
              formRef.current?.submit()
            }}
          />
        </form>
        <button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()} disabled={importing}>
          <ScanLine size={18} /> {importing ? 'กำลังอ่านสลิป...' : 'นำเข้าจากสลิป'}
        </button>
        <button className="primary-button" onClick={onAddClick}>
          <Plus size={19} /> เพิ่มรายการ
        </button>
      </div>
    </div>
  )
}
