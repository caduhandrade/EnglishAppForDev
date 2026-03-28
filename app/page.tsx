'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Stats } from '@/types'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats & { flashcardCount: number; sentenceCount: number } | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{greeting()} 👋</p>
        <h1 className="text-2xl font-bold mt-0.5" style={{ color: 'var(--text)' }}>
          English for Dev
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>
          Inglês técnico para o dia a dia no trabalho
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Precisão"
          value={stats ? `${stats.accuracy}%` : '—'}
          color="var(--accent)"
          icon="🎯"
        />
        <StatCard
          label="Sequência"
          value={stats ? `${stats.streak} dia${stats.streak !== 1 ? 's' : ''}` : '—'}
          color="var(--warning)"
          icon="🔥"
        />
        <StatCard
          label="Corretas"
          value={stats ? String(stats.correct) : '—'}
          color="var(--success)"
          icon="✓"
        />
        <StatCard
          label="Incorretas"
          value={stats ? String(stats.incorrect) : '—'}
          color="var(--error)"
          icon="✗"
        />
      </div>

      {/* Content summary */}
      {stats && (
        <div
          className="rounded-xl p-4 flex justify-around"
          style={{ background: 'var(--surface)' }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
              {stats.flashcardCount}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Flashcards</p>
          </div>
          <div className="w-px" style={{ background: 'var(--surface2)' }} />
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--purple)' }}>
              {stats.sentenceCount}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Exercícios</p>
          </div>
          <div className="w-px" style={{ background: 'var(--surface2)' }} />
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--pink)' }}>
              {stats.total}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Respondidas</p>
          </div>
        </div>
      )}

      {/* Navigation cards */}
      <div className="flex flex-col gap-3">
        <NavCard
          href="/flashcards"
          icon="🃏"
          title="Flashcards"
          description="Estude vocabulário e expressões técnicas"
          color="var(--accent)"
        />
        <NavCard
          href="/sentences"
          icon="✍️"
          title="Exercícios de Frases"
          description="Monte frases em inglês a partir do português"
          color="var(--purple)"
        />
        <NavCard
          href="/progress"
          icon="📊"
          title="Seu Progresso"
          description="Veja seu desempenho por categoria"
          color="var(--warning)"
        />
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{ background: 'var(--surface)' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

function NavCard({ href, icon, title, description, color }: {
  href: string; icon: string; title: string; description: string; color: string
}) {
  return (
    <Link
      href={href}
      className="rounded-xl p-4 flex items-center gap-4 transition-all hover:opacity-90"
      style={{ background: 'var(--surface)', border: '1px solid var(--surface2)' }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
        style={{ background: color + '22' }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{description}</p>
      </div>
      <span style={{ color: 'var(--muted)' }}>›</span>
    </Link>
  )
}
