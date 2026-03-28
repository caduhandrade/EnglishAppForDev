'use client'

import { useEffect, useState, useCallback } from 'react'
import type { SentenceExercise, Category } from '@/types'
import CategorySelector from '@/components/CategorySelector'
import SentenceBuilder from '@/components/SentenceBuilder'
import { getCategories, getSentenceExercises } from '@/lib/data-store'
import { recordProgress as recordProgressDb } from '@/lib/client-db'

export default function SentencesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [allExercises, setAllExercises] = useState<SentenceExercise[]>([])
  const [deck, setDeck]           = useState<SentenceExercise[]>([])
  const [index, setIndex]         = useState(0)
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [done, setDone]           = useState(false)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    // Carrega dados diretamente do módulo
    const cats = getCategories()
    const exs = getSentenceExercises()
    setCategories(cats)
    setAllExercises(exs)
    setLoading(false)
  }, [])

  const buildDeck = useCallback((catId: number | null, exs: SentenceExercise[]) => {
    const filtered = catId ? exs.filter(e => e.categoryId === catId) : exs
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setIndex(0)
    setDone(false)
  }, [])

  useEffect(() => {
    if (allExercises.length > 0) buildDeck(selectedCat, allExercises)
  }, [allExercises, selectedCat, buildDeck])

  async function recordProgress(ex: SentenceExercise, isCorrect: boolean) {
    // Salva progresso no IndexedDB
    await recordProgressDb(ex.id, 'Sentence', isCorrect, ex.categoryId)
  }

  function handleCorrect() {
    recordProgress(deck[index], true)
    if (index + 1 >= deck.length) setDone(true)
    else setIndex(i => i + 1)
  }

  function handleIncorrect() {
    recordProgress(deck[index], false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p style={{ color: 'var(--muted)' }}>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Exercícios de Frases</h1>

      <CategorySelector
        categories={categories}
        selected={selectedCat}
        onChange={id => { setSelectedCat(id) }}
      />

      {done ? (
        <div
          className="rounded-2xl p-8 flex flex-col items-center gap-4 text-center mt-4"
          style={{ background: 'var(--surface)' }}
        >
          <span className="text-5xl">🏆</span>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
            Sessão completa!
          </h2>
          <p style={{ color: 'var(--muted)' }}>
            Você completou {deck.length} exercício{deck.length !== 1 ? 's' : ''}.
          </p>
          <button
            onClick={() => buildDeck(selectedCat, allExercises)}
            className="px-8 py-3 rounded-xl font-semibold"
            style={{ background: 'var(--purple)', color: '#fff' }}
          >
            Jogar novamente
          </button>
        </div>
      ) : deck.length === 0 ? (
        <p className="text-center mt-10" style={{ color: 'var(--muted)' }}>
          Nenhum exercício nesta categoria.
        </p>
      ) : (
        <SentenceBuilder
          key={`${deck[index].id}-${index}`}
          exercise={deck[index]}
          index={index}
          total={deck.length}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      )}
    </div>
  )
}
