'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/',           label: 'Home',       icon: '🏠' },
  { href: '/flashcards', label: 'Flashcards', icon: '🃏' },
  { href: '/sentences',  label: 'Frases',     icon: '✍️' },
  { href: '/progress',   label: 'Progresso',  icon: '📊' },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--surface2)' }}
      className="fixed bottom-0 left-0 right-0 z-50 flex"
    >
      {TABS.map(tab => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center justify-center flex-1 py-3 gap-1 transition-colors"
            style={{
              color: active ? 'var(--accent)' : 'var(--muted)',
              background: active ? 'rgba(100,255,218,0.06)' : 'transparent',
            }}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
