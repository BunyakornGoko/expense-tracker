export type Transaction = {
  id: number
  title: string
  category: string
  date: string
  amount: number
  type: 'income' | 'expense'
  note: string
  color: string
}

export const initialTransactions: Transaction[] = [
  { id: 1, title: 'เงินเดือนประจำเดือน', category: 'เงินเดือน', date: 'วันนี้, 09:30', amount: 32000, type: 'income', note: 'เงินเดือนเดือนมิถุนายน', color: 'mint' },
  { id: 2, title: 'ค่าอาหารกลางวัน', category: 'อาหาร', date: 'วันนี้, 12:45', amount: 180, type: 'expense', note: 'ข้าวหน้าเนื้อร้านโปรด', color: 'peach' },
  { id: 3, title: 'ค่าสมาชิก Netflix', category: 'บันเทิง', date: 'เมื่อวาน, 20:10', amount: 419, type: 'expense', note: 'แพ็กเกจ Standard', color: 'lavender' },
  { id: 4, title: 'ค่าเดินทาง BTS', category: 'เดินทาง', date: 'เมื่อวาน, 08:20', amount: 92, type: 'expense', note: 'ไปทำงาน', color: 'yellow' },
]

export const categories = ['ทั้งหมด', 'อาหาร', 'เดินทาง', 'บันเทิง', 'เงินเดือน', 'ช้อปปิ้ง']

export const formatMoney = (amount: number) => new Intl.NumberFormat('th-TH').format(amount)
