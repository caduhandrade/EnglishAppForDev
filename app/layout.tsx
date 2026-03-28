import type { Metadata } from 'next'
import './globals.css'
import TabBar from '@/components/TabBar'

export const metadata: Metadata = {
  title: 'English for Dev',
  description: 'Aprenda inglês técnico com flashcards e exercícios',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="max-w-lg mx-auto px-4 pt-5 pb-24 min-h-screen">
          {children}
        </main>
        <TabBar />
      </body>
    </html>
  )
}
