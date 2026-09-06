import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMonthLabel } from '@/lib/transactions'

type MonthNavProps = {
  monthKey: string
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

export function MonthNav({ monthKey, onPrev, onNext, canPrev, canNext }: MonthNavProps) {
  return (
    <div className="month-nav">
      <button className="icon-button" onClick={onPrev} disabled={!canPrev} aria-label="เดือนก่อนหน้า">
        <ChevronLeft size={18} />
      </button>
      <span className="month-label">{formatMonthLabel(monthKey)}</span>
      <button className="icon-button" onClick={onNext} disabled={!canNext} aria-label="เดือนถัดไป">
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
