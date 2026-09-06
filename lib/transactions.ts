export type Transaction = {
  id: number
  title: string
  category: string
  date: string // ISO datetime
  amount: number
  type: 'income' | 'expense'
  note: string
  color: string
}

export const getTodayKey = () => new Date().toISOString().slice(0, 10)

export const initialTransactions: Transaction[] = []

export const categories = ['ทั้งหมด', 'อาหาร', 'เดินทาง', 'บันเทิง', 'เงินเดือน', 'ช้อปปิ้ง']

export const formatMoney = (amount: number) => new Intl.NumberFormat('th-TH').format(amount)

export const getDayKey = (isoDate: string) => isoDate.slice(0, 10)
export const getMonthKey = (isoDate: string) => isoDate.slice(0, 7)

export function formatDayLabel(dayKey: string): string {
  const today = getTodayKey()
  if (dayKey === today) return 'วันนี้'
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (dayKey === yesterday.toISOString().slice(0, 10)) return 'เมื่อวาน'
  return new Date(dayKey).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', weekday: 'short' })
}

export function formatTime(isoDate: string): string {
  const [, time] = isoDate.split('T')
  return time.slice(0, 5)
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })
}

export function formatFullDateLabel(dayKey: string): string {
  return new Date(dayKey).toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function combineDateWithCurrentTime(dateKey: string): string {
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`
  return `${dateKey}T${time}`
}

export function getAvailableMonths(transactions: Transaction[]): string[] {
  return Array.from(new Set(transactions.map((item) => getMonthKey(item.date)))).sort((a, b) => b.localeCompare(a))
}

export function getPreviousMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 2, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function sumByType(transactions: Transaction[]): { income: number; expense: number } {
  return {
    income: transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0),
    expense: transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0),
  }
}

// null means "no baseline last month", distinct from 0% (no change)
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / previous) * 100
}

export function formatChangeNote(percent: number | null): string {
  if (percent === null) return 'ไม่มีข้อมูลเดือนที่แล้ว'
  if (percent === 0) return 'เท่ากับเดือนที่แล้ว'
  const rounded = Math.abs(percent).toFixed(1)
  return percent > 0 ? `↑ เพิ่มขึ้น ${rounded}% จากเดือนที่แล้ว` : `↓ ลดลง ${rounded}% จากเดือนที่แล้ว`
}

export function formatTrendChip(percent: number | null): string {
  if (percent === null) return '—'
  const rounded = Math.abs(percent).toFixed(1)
  return percent >= 0 ? `↗ ${rounded}%` : `↘ ${rounded}%`
}

export type DayGroup = {
  dayKey: string
  transactions: Transaction[]
  income: number
  expense: number
}

export function groupByDay(transactions: Transaction[]): DayGroup[] {
  const byDay = new Map<string, Transaction[]>()
  for (const item of transactions) {
    const key = getDayKey(item.date)
    byDay.set(key, [...(byDay.get(key) ?? []), item])
  }
  return Array.from(byDay.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([dayKey, items]) => ({
      dayKey,
      transactions: items,
      income: items.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0),
      expense: items.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0),
    }))
}
