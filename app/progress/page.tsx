'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Stats, CategoryStats, UserProgress, Category } from '@/types'
import { getCategories, getFlashcardCount, getSentenceCount } from '@/lib/data-store'
import { getStats, getRecentProgress, resetProgress } from '@/lib/client-db'

interface FullStats extends Stats {
  categoryStats: CategoryStats[]
  flashcardCount: number
  sentenceCount: number
}

function formatTime(iso: string) {
  const now = new Date()
  const then = new Date(iso)
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000)
  if (diff < 60)  return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d atrás`
  return then.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function ProgressPage() {
  const [stats, setStats]       = useState<FullStats | null>(null)
  const [recent, setRecent]     = useState<UserProgress[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]   = useState(true)
  const [confirming, setConfirming] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      getStats(),
      getRecentProgress(),
      Promise.resolve(getCategories()),
    ]).then(([s, r, c]) => {
      // Preenche os campos extras de FullStats
      const fullStats: FullStats = {
        ...s,
        categoryStats: [],
        flashcardCount: getFlashcardCount(),
        sentenceCount: getSentenceCount(),
      }
      setStats(fullStats)
      setRecent(r)
      setCategories(c)
      setLoading(false)
    })
  }, [])

  useEffect(() => { load() }, [load])

  async function handleReset() {
    await resetProgress()
    setConfirming(false)
    load()
  }

  const catById = Object.fromEntries(categories.map(c => [c.id, c]))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p style={{ color: 'var(--muted)' }}>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Seu Progresso</h1>
        <button
          onClick={() => setConfirming(true)}
          className="text-xs px-3 py-1.5 rounded-full"
          style={{ color: 'var(--error)', border: '1px solid var(--error)', background: 'transparent' }}
        >
          Resetar
        </button>
      </div>

      {/* Confirm reset dialog */}
      {confirming && (
        <div
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{ background: 'var(--error)' + '22', border: '1px solid var(--error)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--error)' }}>
            Tem certeza? Todo o progresso será apagado.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 py-2 rounded-lg text-sm"
              style={{ background: 'var(--surface2)', color: 'var(--text2)' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--error)', color: '#fff' }}
            >
              Sim, resetar
            </button>
          </div>
        </div>
      )}

      {/* Overview */}
      {stats && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--surface)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{stats.accuracy}%</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Precisão</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--surface)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>{stats.streak}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Dias seguidos</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--surface)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{stats.total}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Total</p>
            </div>
          </div>

          {/* Correct / Incorrect bar */}
          {stats.total > 0 && (
            <div className="rounded-xl p-4" style={{ background: 'var(--surface)' }}>
              <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--muted)' }}>
                <span>✓ {stats.correct} corretas</span>
                <span>{stats.incorrect} incorretas ✗</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--error)' + '44' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${stats.accuracy}%`,
                    background: 'var(--success)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Per-category stats */}
          {stats.categoryStats.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text2)' }}>
                Por categoria
              </h2>
              {stats.categoryStats
                .sort((a, b) => b.total - a.total)
                .map(cs => {
                  const cat = catById[cs.categoryId]
                  if (!cat) return null
                  return (
                    <div
                      key={cs.categoryId}
                      className="rounded-xl p-3"
                      style={{ background: 'var(--surface)' }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>
                          {cs.correct}/{cs.total} · {cs.accuracy}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'var(--surface2)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${cs.accuracy}%`,
                            background: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </>
      )}

      {/* Recent activity */}
      {recent.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text2)' }}>
            Atividade recente
          </h2>
          <div className="flex flex-col gap-2">
            {recent.map(r => {
              const cat = catById[r.categoryId]
              return (
                <div
                  key={r.id}
                  className="rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ background: 'var(--surface)' }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold"
                      style={{ color: r.isCorrect ? 'var(--success)' : 'var(--error)' }}
                    >
                      {r.isCorrect ? '✓' : '✗'}
                    </span>
                    <div>
                      <span className="text-sm" style={{ color: 'var(--text2)' }}>
                        {r.itemType}
                      </span>
                      {cat && (
                        <span className="text-xs ml-2" style={{ color: 'var(--muted)' }}>
                          {cat.icon} {cat.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
                    {formatTime(r.timestamp)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!stats || stats.total === 0 ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">📭</p>
          <p style={{ color: 'var(--muted)' }}>Nenhuma atividade ainda.</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Comece com os flashcards ou exercícios de frases!
          </p>
        </div>
      ) : null}
    </div>
  )
}
