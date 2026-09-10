// Supports two slip formats: "Make by KBank" (English) and K PLUS (Thai)

const EN_MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

const THAI_MONTHS: Record<string, number> = {
  'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
  'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12,
}

const THAI_MONTH_PATTERN = Object.keys(THAI_MONTHS)
  .map((month) => month.replace(/\./g, '\\.'))
  .join('|')

const pad = (n: number) => String(n).padStart(2, '0')

function extractDate(text: string): string | null {
  const en = text.match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})\s+(\d{1,2}):(\d{2})/)
  if (en) {
    const month = EN_MONTHS[en[2].toLowerCase()]
    if (!month) return null
    return `${en[3]}-${pad(month)}-${pad(Number(en[1]))}T${pad(Number(en[4]))}:${en[5]}:00`
  }

  const th = text.match(new RegExp(`(\\d{1,2})\\s+(${THAI_MONTH_PATTERN})\\s+(\\d{2})\\D+(\\d{1,2}):(\\d{2})`))
  if (th) {
    const month = THAI_MONTHS[th[2]]
    if (!month) return null
    const year = 1957 + Number(th[3]) // BE 25xx -> CE, e.g. 69 -> 2569 -> 2026
    return `${year}-${pad(month)}-${pad(Number(th[1]))}T${pad(Number(th[4]))}:${th[5]}:00`
  }

  return null
}

function extractAmount(text: string): number | null {
  const match = text.match(/(Amount|จำนวน)[^\d]*?([\d,]+\.\d{2})/i)
  if (!match) return null
  return Number(match[2].replace(/,/g, ''))
}

const isMaskedAccountLine = (line: string) => /^[x\d-]+$/i.test(line) && /\d/.test(line) && line.length >= 5

function extractRecipient(text: string): string | null {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
  const maskedIndex = lines.findIndex(isMaskedAccountLine)
  if (maskedIndex === -1) return null

  for (let i = maskedIndex + 1; i < lines.length; i++) {
    if (/[a-zA-Zก-๙]/.test(lines[i])) {
      return lines[i].replace(/\s*\([^)]*\)\s*$/, '').trim()
    }
  }
  return null
}

export type ParsedSlip = { amount: number; date: string; title: string }

export function parseSlipText(rawText: string): ParsedSlip | null {
  const text = rawText.normalize('NFC')
  const amount = extractAmount(text)
  const date = extractDate(text)
  const title = extractRecipient(text)
  if (amount === null || date === null || !title) return null
  return { amount, date, title }
}
