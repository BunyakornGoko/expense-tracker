import { Menu } from 'lucide-react'

type TopbarProps = {
  onOpenMenu: () => void
}

export function Topbar({ onOpenMenu }: TopbarProps) {
  return (
    <header className="topbar">
      <button className="icon-button menu-toggle" onClick={onOpenMenu} aria-label="เปิดเมนู">
        <Menu size={22} />
      </button>
      <div className="breadcrumb">
        ภาพรวม <span>/</span> มิถุนายน 2026
      </div>
    </header>
  )
}
