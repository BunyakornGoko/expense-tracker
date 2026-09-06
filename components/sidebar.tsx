import { useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut, X } from 'lucide-react'
import { KuromiMark } from './kuromi-mark'

type SidebarProps = {
  mobileOpen: boolean
  onClose: () => void
  userName: string
}

export function Sidebar({ mobileOpen, onClose, userName }: SidebarProps) {
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.push('/login')
      router.refresh()
    }
  }

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
      <div className="sidebar-footer-user">
        <span className="user-name">{userName}</span>
        <button className="nav-item" onClick={handleLogout}>
          <LogOut size={16} /> ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}
