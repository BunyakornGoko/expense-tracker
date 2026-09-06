import { LayoutDashboard, X } from 'lucide-react'
import { KuromiMark } from './kuromi-mark'

type SidebarProps = {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <aside className={mobileOpen ? 'sidebar mobile-open' : 'sidebar'}>
      <div className="brand-row">
        <KuromiMark />
        <div>
          <p className="brand-name">KUROMI</p>
          <p className="brand-sub">MONEY DIARY</p>
        </div>
        <button className="icon-button close-menu" onClick={onClose} aria-label="ปิดเมนู">
          <X size={18} />
        </button>
      </div>
      <nav className="side-nav" aria-label="เมนูหลัก">
        <p className="nav-label">เมนูหลัก</p>
        <div className="nav-item active">
          <LayoutDashboard size={18} /> ภาพรวม <span className="active-dot" />
        </div>
      </nav>
    </aside>
  )
}
