/**
 * Data Store - Provides static data without database
 * All data is loaded from seed-data and served via API
 */

import { CATEGORIES, FLASHCARDS, EXERCISES } from './seed-data'
import type { Category, Flashcard, SentenceExercise } from '@/types'

// ── Categories ────────────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  return CATEGORIES as Category[]
}

export function getCategoryById(id: number): Category | undefined {
  return CATEGORIES.find(c => c.id === id) as Category | undefined
}

// ── Flashcards ────────────────────────────────────────────────────────────────

export function getFlashcards(categoryId?: number): Flashcard[] {
  if (categoryId) {
    return FLASHCARDS.filter(f => f.categoryId === categoryId).map((f, idx) => ({
      ...f,
      id: idx + 1,
    })) as Flashcard[]
  }
  return FLASHCARDS.map((f, idx) => ({
    ...f,
    id: idx + 1,
  })) as Flashcard[]
}

export function getFlashcardCount(): number {
  return FLASHCARDS.length
}

// ── Sentence Exercises ────────────────────────────────────────────────────────

export function getSentenceExercises(categoryId?: number): SentenceExercise[] {
  if (categoryId) {
    return EXERCISES.filter(e => e.categoryId === categoryId).map((e, idx) => ({
      ...e,
      id: idx + 1,
    })) as SentenceExercise[]
  }
  return EXERCISES.map((e, idx) => ({
    ...e,
    id: idx + 1,
  })) as SentenceExercise[]
}

export function getSentenceCount(): number {
  return EXERCISES.length
}
