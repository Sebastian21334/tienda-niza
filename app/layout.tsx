import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { getStoreConfig } from '@/services/store-service'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStoreConfig()
  return {
    title: `${store.name} — ${store.slogan}`,
    description: store.description,
    generator: 'v0.app',
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f3ec',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${playfair.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
