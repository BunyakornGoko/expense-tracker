import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'
import './globals.css'

const notoThai = Noto_Sans_Thai({ subsets: ['thai', 'latin'], variable: '--font-thai' })

export const metadata: Metadata = {
  title: 'Kuromi Money Diary | ภาพรวมการเงิน',
  description: 'จัดการรายรับรายจ่ายของคุณในสไตล์ Kuromi',
  generator: 'v0.app',
  icons: {
    icon: '/Kuromi%20List.webp',
    apple: '/Kuromi.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kuromi Diary',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f4f1f8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className="bg-background">
      <body className={`${notoThai.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
