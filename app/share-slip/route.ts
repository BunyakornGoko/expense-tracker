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

// Behind the Caddy reverse proxy, request.url can resolve to the container's own hostname
// instead of the public domain, so NextResponse.redirect(new URL(path, request.url)) sends the
// browser to an address it can't reach. A relative Location header sidesteps that entirely —
// browsers resolve it against the page's own address bar, not anything the server guesses.
function redirectTo(path: string) {
  return new Response(null, { status: 303, headers: { Location: path } })
}

export async function POST(request: Request) {
  const user = await getSession()
  if (!user) return redirectTo('/login')

  const formData = await request.formData()
  const file = formData.get('image')
  if (!(file instanceof File)) {
    return redirectTo('/?slip=missing')
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
      return redirectTo('/?slip=failed')
    }

    await addTransaction(user.id, {
      title: parsed.title,
      amount: parsed.amount,
      category: 'ช้อปปิ้ง',
      date: parsed.date,
      type: 'expense',
      note: 'นำเข้าจากสลิป',
    })

    return redirectTo('/?slip=saved')
  } catch (error) {
    console.error('share-slip failed', error)
    workerPromise = null // drop a possibly-broken worker so the next request starts fresh
    return redirectTo('/?slip=failed')
  }
}
