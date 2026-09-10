import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseSlipText } from './parse-slip'

test('parses Make by KBank slip (English)', () => {
  const text = `TRANSFER COMPLETED
10 Sep 2026 23:34

BUNYAKORN P
xxx-x-x1241-x

CHADWALAI KANCHANAPAETNUKUL
xxx-xxx-6094

Amount
500.00 Baht

Fee
0.00 Baht`
  assert.deepEqual(parseSlipText(text), {
    amount: 500,
    date: '2026-09-10T23:34:00',
    title: 'CHADWALAI KANCHANAPAETNUKUL',
  })
})

test('parses K PLUS slip (Thai)', () => {
  const text = `จ่ายบิลสำเร็จ
10 ก.ย. 69  19:20 น.

นาย บุณยกร พ
ธ.กสิกรไทย
xxx-x-x3186-x

LINE MAN (QR by ttb)
DAHA0KPR3FOC70503F7G

เลขที่รายการ:
016253192000BPM19838
จำนวน:
7.00 บาท
ค่าธรรมเนียม:
0.00 บาท`
  assert.deepEqual(parseSlipText(text), {
    amount: 7,
    date: '2026-09-10T19:20:00',
    title: 'LINE MAN',
  })
})

test('returns null when text has no recognizable slip fields', () => {
  assert.equal(parseSlipText('random receipt text with nothing useful'), null)
})
