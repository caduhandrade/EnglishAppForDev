'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Flashcard, Category } from '@/types'
import CategorySelector from '@/components/CategorySelector'
import FlashCard from '@/components/FlashCard'
import { getCategories, getFlashcards } from '@/lib/data-store'
import { recordProgress as recordProgressDb } from '@/lib/client-db'

export default function FlashcardsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [allCards, setAllCards]     = useState<Flashcard[]>([])
  const [deck, setDeck]             = useState<Flashcard[]>([])
  const [index, setIndex]           = useState(0)
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [done, setDone]             = useState(false)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    // Carrega dados diretamente do módulo
    const cats = getCategories()
    const cards = getFlashcards()
    setCategories(cats)
    setAllCards(cards)
    setLoading(false)
  }, [])

  const buildDeck = useCallback((catId: number | null, cards: Flashcard[]) => {
    const filtered = catId ? cards.filter(c => c.categoryId === catId) : cards
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setIndex(0)
    setDone(false)
  }, [])

  useEffect(() => {
    if (allCards.length > 0) buildDeck(selectedCat, allCards)
  }, [allCards, selectedCat, buildDeck])

  async function recordProgress(card: Flashcard, isCorrect: boolean) {
    // Salva progresso no IndexedDB
    await recordProgressDb(card.id, 'Flashcard', isCorrect, card.categoryId)
  }

  function handleKnow() {
    recordProgress(deck[index], true)
    advance()
  }

  function handleDontKnow() {
    recordProgress(deck[index], false)
    advance()
  }

  function advance() {
    if (index + 1 >= deck.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Flashcards</h1>

      <CategorySelector
        categories={categories}
        selected={selectedCat}
        onChange={id => { setSelectedCat(id) }}
      />

      {done ? (
        <DoneScreen
          total={deck.length}
          onRestart={() => buildDeck(selectedCat, allCards)}
        />
      ) : deck.length === 0 ? (
        <p className="text-center mt-10" style={{ color: 'var(--muted)' }}>
          Nenhum flashcard nesta categoria.
        </p>
      ) : (
        <FlashCard
          key={`${deck[index].id}-${index}`}
          card={deck[index]}
          index={index}
          total={deck.length}
          onKnow={handleKnow}
          onDontKnow={handleDontKnow}
        />
      )}
    </div>
  )
}

function DoneScreen({ total, onRestart }: { total: number; onRestart: () => void }) {
  return (
    <div
      className="rounded-2xl p-8 flex flex-col items-center gap-4 text-center mt-4"
      style={{ background: 'var(--surface)' }}
    >
      <span className="text-5xl">🎉</span>
      <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
        Sessão completa!
      </h2>
      <p style={{ color: 'var(--muted)' }}>
        Você revisou {total} flashcard{total !== 1 ? 's' : ''}.
      </p>
      <button
        onClick={onRestart}
        className="px-8 py-3 rounded-xl font-semibold"
        style={{ background: 'var(--accent)', color: '#0F1117' }}
      >
        Jogar novamente
      </button>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-40">
      <p style={{ color: 'var(--muted)' }}>Carregando...</p>
    </div>
  )
}
