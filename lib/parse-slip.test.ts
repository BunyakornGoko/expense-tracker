import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseSlipText } from './parse-slip'

// Real tesseract.js output from an actual "Make by KBank" slip screenshot (kept verbatim,
// including its OCR noise) so the parser is tested against real-world garbling, not clean text.
test('parses a real Make by KBank OCR dump (English, noisy)', () => {
  const text = `TRANSFER                  maKe
by KBank
COMPLETED
10 Sep 2026 23:34
 BUNYAKORN P
ล๕๑ด ๐1241-«
ง,
CHADWALAI
KANCHANAPAETNUKUL
XXX-XXxx-6094
Amount                                                           [ตไร wom
Tp PEL
500.00 sant                                 fo =]
Fee                                       O41 ตา
0.00 Baht                                         Scan to verify
Transaction ID: 0462535095j1ct2up4Ul`
  assert.deepEqual(parseSlipText(text), {
    amount: 500,
    date: '2026-09-10T23:34:00',
    title: 'CHADWALAI KANCHANAPAETNUKUL',
  })
})

// Real tesseract.js output from an actual K PLUS slip screenshot after grayscale/contrast
// preprocessing (the route runs this before OCR — see app/share-slip/route.ts). Still noisy:
// includes the decomposed-sara-am artifact "จํานวน" and a garbled masked-account line.
test('parses a real K PLUS OCR dump (Thai, noisy, preprocessed)', () => {
  const text = `จ่ายบิลสําเร็จ
10 ก.ย. 69 19:20 wu.                              I<+
นาย บุณยกร พ
ด)   ธ.กสิกรไทย
%%%-%-%3186-%
"     LINE MAN (QR by ttb)
    DAHAOKPR3FOC70503F7G
260910900801037F0771
เลขที่รายการ:
016253192000BPM19838 [=]: [|
     &,                                 เพ  พ แลน ลรซี   ไน
จํานวน:                         4 ช่ EE
7.00 บาท       ล   = gue =
ย       5                                         =|
คาธรรมเนยม:                          Op, Sp
0.00 บาท      สแกนตรวจสอบสลิป`
  const parsed = parseSlipText(text)
  assert.ok(parsed)
  assert.equal(parsed?.amount, 7)
  assert.equal(parsed?.date, '2026-09-10T19:20:00')
  // recipient extraction is best-effort on text this noisy; a sane fallback beats saving garbage
  assert.ok(parsed && !/\d{5}/.test(parsed.title), `title should not be a reference code: ${parsed?.title}`)
})

// A second real OCR run of the same K PLUS slip (tesseract's output isn't fully deterministic
// run-to-run) garbled the month abbreviation past recovery ("กุย." instead of "ก.ย."). Date
// should fall back to "now" rather than block the save — amount is still read correctly.
test('falls back to now when the Thai month abbreviation is unrecoverable', () => {
  const text = `จายบลสาเรจ
10 กุย. 69 19:20 wu.                             I+
นาย บุณยกร พ
(“จ#)   ธ.กสิกรไทย
=" xxx-x-x3186-x
ว     LINE MAN (QR by ttb)
    DAHAOKPR3FOC70503F7G
260910900801037F0771
เลขที่รายการ:
016253192000BPM19838 [=] ra [=]
บ     :                               Lp รโล ไน
จํานวน:                         2 ญูร นต
7.00 บาท       ร ไร
ซ
ค่าธรรมเนียม:                         [ต2 a
0.00 บาท     สแกนตรวจสอบสลิป`
  const parsed = parseSlipText(text)
  assert.ok(parsed)
  assert.equal(parsed?.amount, 7)
  // fell back to "now" rather than returning null or a wrong date
  assert.match(parsed!.date, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
})

test('returns null when text has no recognizable slip fields', () => {
  assert.equal(parseSlipText('random receipt text with nothing useful'), null)
})
