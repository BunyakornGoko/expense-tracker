import { Menu } from 'lucide-react'
import { formatMonthLabel } from '@/lib/transactions'

type TopbarProps = {
  monthKey: string
  onOpenMenu: () => void
}

export function Topbar({ monthKey, onOpenMenu }: TopbarProps) {
  return (
    <header className="topbar">
      <button className="icon-button menu-toggle" onClick={onOpenMenu} aria-label="เปิดเมนู">
        <Menu size={22} />
      </button>
      <div className="breadcrumb">
        ภาพรวม <span>/</span> {formatMonthLabel(monthKey)}
      </div>
    </header>
  )
}
