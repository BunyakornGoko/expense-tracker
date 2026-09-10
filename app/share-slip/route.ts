import { NextResponse } from 'next/server'
import { createWorker, type Worker } from 'tesseract.js'
import sharp from 'sharp'
import { getSession } from '@/lib/auth-cookies'
import { addTransaction } from '@/lib/transactions-store'
import { parseSlipText } from '@/lib/parse-slip'

export const maxDuration = 60 // OCR + first-run language data download can take a while

// This route runs on a long-lived Node process (Docker on a VM), not serverless — reuse one
// worker across requests instead of paying full engine-load cost on every upload.
let workerPromise: Promise<Worker> | null = null
function getWorker() {
  if (!workerPromise) {
    workerPromise = createWorker('tha+eng', undefined, { cachePath: '/tmp' })
  }
  return workerPromise
}

export async function POST(request: Request) {
  const user = await getSession()
  if (!user) return NextResponse.redirect(new URL('/login', request.url), 303)

  const formData = await request.formData()
  const file = formData.get('image')
  if (!(file instanceof File)) {
    return NextResponse.redirect(new URL('/?slip=missing', request.url), 303)
  }

  try {
    const rawBuffer = Buffer.from(await file.arrayBuffer())
    // slips are often low-contrast pastel gradients; grayscale + contrast normalize measurably
    // improves OCR accuracy on them (verified against real slip screenshots)
    const buffer = await sharp(rawBuffer).rotate().resize({ width: 1600, withoutEnlargement: true }).grayscale().normalize().sharpen().toBuffer()
    const worker = await getWorker()
    const { data } = await worker.recognize(buffer)

    const parsed = parseSlipText(data.text)
    if (!parsed) {
      return NextResponse.redirect(new URL('/?slip=failed', request.url), 303)
    }

    await addTransaction(user.id, {
      title: parsed.title,
      amount: parsed.amount,
      category: 'ช้อปปิ้ง',
      date: parsed.date,
      type: 'expense',
      note: 'นำเข้าจากสลิป',
    })

    return NextResponse.redirect(new URL('/?slip=saved', request.url), 303)
  } catch (error) {
    console.error('share-slip failed', error)
    workerPromise = null // drop a possibly-broken worker so the next request starts fresh
    return NextResponse.redirect(new URL('/?slip=failed', request.url), 303)
  }
}
