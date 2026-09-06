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

export const initialTransactions: Transaction[] = [
  { id: 1, title: 'เงินเดือนประจำเดือน', category: 'เงินเดือน', date: '2026-06-18T09:30:00', amount: 32000, type: 'income', note: 'เงินเดือนเดือนมิถุนายน', color: 'mint' },
  { id: 2, title: 'ค่าอาหารกลางวัน', category: 'อาหาร', date: '2026-06-18T12:45:00', amount: 180, type: 'expense', note: 'ข้าวหน้าเนื้อร้านโปรด', color: 'peach' },
  { id: 3, title: 'ค่าสมาชิก Netflix', category: 'บันเทิง', date: '2026-06-17T20:10:00', amount: 419, type: 'expense', note: 'แพ็กเกจ Standard', color: 'lavender' },
  { id: 4, title: 'ค่าเดินทาง BTS', category: 'เดินทาง', date: '2026-06-17T08:20:00', amount: 92, type: 'expense', note: 'ไปทำงาน', color: 'yellow' },
]

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
