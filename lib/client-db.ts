'use client'

/**
 * Client-side IndexedDB service for storing user progress
 * This runs in the browser only
 */

import type { UserProgress, Stats, CategoryStats } from '@/types'

const DB_NAME = 'EnglishTechApp'
const DB_VERSION = 1
const PROGRESS_STORE = 'user_progress'

let dbInstance: IDBDatabase | null = null

async function getDb(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        const store = db.createObjectStore(PROGRESS_STORE, { keyPath: 'id', autoIncrement: true })
        store.createIndex('timestamp', 'timestamp', { unique: false })
        store.createIndex('categoryId', 'categoryId', { unique: false })
      }
    }
  })
}

// ── Progress Management ────────────────────────────────────────────────────────

export async function recordProgress(
  itemId: number,
  itemType: string,
  isCorrect: boolean,
  categoryId: number
): Promise<void> {
  const db = await getDb()
  const tx = db.transaction([PROGRESS_STORE], 'readwrite')
  const store = tx.objectStore(PROGRESS_STORE)

  const record: UserProgress = {
    id: 0,
    itemId,
    itemType,
    isCorrect,
    timestamp: new Date().toISOString(),
    categoryId,
  }

  return new Promise((resolve, reject) => {
    const request = store.add(record)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getRecentProgress(count = 20): Promise<UserProgress[]> {
  const db = await getDb()
  const tx = db.transaction([PROGRESS_STORE], 'readonly')
  const store = tx.objectStore(PROGRESS_STORE)
  const index = store.index('timestamp')

  return new Promise((resolve, reject) => {
    const request = index.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const results = request.result as UserProgress[]
      resolve(results.reverse().slice(0, count))
    }
  })
}

export async function resetProgress(): Promise<void> {
  const db = await getDb()
  const tx = db.transaction([PROGRESS_STORE], 'readwrite')
  const store = tx.objectStore(PROGRESS_STORE)

  return new Promise((resolve, reject) => {
    const request = store.clear()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

// ── Statistics ────────────────────────────────────────────────────────────────

export async function getStats(): Promise<Stats> {
  const db = await getDb()
  const tx = db.transaction([PROGRESS_STORE], 'readonly')
  const store = tx.objectStore(PROGRESS_STORE)

  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const records = request.result as UserProgress[]
      const total = records.length
      const correct = records.filter(r => r.isCorrect).length
      const streak = calculateStreak(records)

      resolve({
        total,
        correct,
        incorrect: total - correct,
        streak,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      })
    }
  })
}

export async function getCategoryStats(): Promise<CategoryStats[]> {
  const db = await getDb()
  const tx = db.transaction([PROGRESS_STORE], 'readonly')
  const store = tx.objectStore(PROGRESS_STORE)

  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const records = request.result as UserProgress[]
      const map = new Map<number, { total: number; correct: number }>()

      for (const record of records) {
        const entry = map.get(record.categoryId) ?? { total: 0, correct: 0 }
        entry.total++
        if (record.isCorrect) entry.correct++
        map.set(record.categoryId, entry)
      }

      const result = Array.from(map.entries()).map(([categoryId, { total, correct }]) => ({
        categoryId,
        total,
        correct,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      }))

      resolve(result)
    }
  })
}

// ── Utility ────────────────────────────────────────────────────────────────────

function calculateStreak(records: UserProgress[]): number {
  if (records.length === 0) return 0

  const sortedByDate = records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  const uniqueDates = new Map<string, boolean>()

  for (const record of sortedByDate) {
    const date = record.timestamp.slice(0, 10)
    uniqueDates.set(date, true)
  }

  const dates = Array.from(uniqueDates.keys()).sort().reverse()
  if (dates.length === 0) return 0

  const today = new Date().toISOString().slice(0, 10)
  let streak = 0
  let expected = today

  for (const date of dates) {
    if (date === expected) {
      streak++
      const prev = new Date(expected)
      prev.setDate(prev.getDate() - 1)
      expected = prev.toISOString().slice(0, 10)
    } else if (date < expected) {
      break
    }
  }

  return streak
}
