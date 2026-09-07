import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kuromi Money Diary',
    short_name: 'Kuromi Diary',
    description: 'จัดการรายรับรายจ่ายของคุณในสไตล์ Kuromi',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f1f8',
    theme_color: '#6c46ad',
    icons: [
      { src: '/Kuromi.png', sizes: '240x240', type: 'image/png' },
      { src: '/Kuromi%20List.webp', sizes: '360x360', type: 'image/webp' },
    ],
  }
}
