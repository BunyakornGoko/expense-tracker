// Supports two slip formats: "Make by KBank" (English) and K PLUS (Thai)

import { combineDateWithCurrentTime, getTodayKey } from './transactions'

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

// OCR frequently outputs Thai sara-am (ำ) as its decomposed form (nikhahit + sara-aa),
// which isn't NFC-equivalent to the precomposed character, so labels like "จำนวน" miss.
const normalizeThai = (text: string) => text.normalize('NFC').replace(/ํา/g, 'ำ')

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
  const label = text.match(/Amount|จำนวน/i)
  if (!label || label.index === undefined) return null
  // search after the label for the first properly decimal-formatted number, rather than
  // requiring an unbroken non-digit gap — OCR sometimes drops a stray digit in between
  const amount = text.slice(label.index).match(/[\d,]+\.\d{2}/)
  if (!amount) return null
  return Number(amount[0].replace(/,/g, ''))
}

const isMaskedAccountLine = (line: string) => /^[x\d-]+$/i.test(line) && /\d/.test(line) && line.length >= 5
const isLabelLine = (line: string) => /[:：]$/.test(line)
// long alphanumeric blobs (reference/transaction codes) mix letters and digits with no spaces
const isReferenceCode = (line: string) => /^[A-Za-z0-9]{10,}$/.test(line) && /\d/.test(line) && /[A-Za-z]/.test(line)
const hasWordChar = (line: string) => /[a-zA-Zก-๙]/.test(line)

// Recipient name sits directly above the Amount label, possibly wrapped across two lines,
// with junk (masked account, reference codes, field labels) interleaved above/around it.
function extractRecipient(text: string): string | null {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
  const amountIndex = lines.findIndex((line) => /amount|จำนวน/i.test(line))
  if (amountIndex === -1) return null

  const collected: string[] = []
  for (let i = amountIndex - 1; i >= 0 && collected.length < 2; i--) {
    const line = lines[i]
    if (isMaskedAccountLine(line) || isLabelLine(line) || isReferenceCode(line)) {
      if (collected.length > 0) break // junk directly above the name block marks its start
      continue
    }
    if (!hasWordChar(line)) continue
    collected.unshift(line)
  }

  if (collected.length === 0) return null
  return collected.join(' ').replace(/\s*\([^)]*\)\s*$/, '').trim()
}

// A misfired recipient match (e.g. a reference code slipping through) is mostly digits;
// a real name is mostly letters. Fall back rather than saving garbage as the title.
function looksLikeGarbage(title: string): boolean {
  const letters = (title.match(/[a-zA-Zก-๙]/g) ?? []).length
  const digits = (title.match(/[0-9]/g) ?? []).length
  return letters < 2 || digits > letters
}

export type ParsedSlip = { amount: number; date: string; title: string }

// Amount is the one field OCR reads reliably; date and title are best-effort with sane
// fallbacks (slips are imported right after the transfer, so "now" is usually correct anyway).
export function parseSlipText(rawText: string): ParsedSlip | null {
  const text = normalizeThai(rawText)
  const amount = extractAmount(text)
  if (amount === null) return null

  const date = extractDate(text) ?? combineDateWithCurrentTime(getTodayKey())
  const recipient = extractRecipient(text)
  const title = recipient && !looksLikeGarbage(recipient) ? recipient : 'รายการจากสลิป'
  return { amount, date, title }
}
