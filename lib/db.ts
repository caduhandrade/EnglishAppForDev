import Database from 'better-sqlite3'
import path from 'path'
import { CATEGORIES, FLASHCARDS, EXERCISES } from './seed-data'
import type { Category, Flashcard, SentenceExercise, UserProgress, Stats, CategoryStats } from '@/types'

const DB_PATH = path.join(process.cwd(), 'english-tech.db')

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    initSchema(_db)
    seedIfEmpty(_db)
  }
  return _db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id          INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      namePT      TEXT NOT NULL,
      icon        TEXT NOT NULL DEFAULT '',
      color       TEXT NOT NULL DEFAULT '#64FFDA',
      description TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS flashcards (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryId         INTEGER NOT NULL,
      englishText        TEXT NOT NULL,
      portugueseText     TEXT NOT NULL,
      exampleSentence    TEXT NOT NULL DEFAULT '',
      exampleTranslation TEXT NOT NULL DEFAULT '',
      verbTense          TEXT NOT NULL DEFAULT '',
      type               TEXT NOT NULL DEFAULT 'Phrase',
      difficulty         INTEGER NOT NULL DEFAULT 1,
      contextTag         TEXT NOT NULL DEFAULT 'General'
    );

    CREATE TABLE IF NOT EXISTS sentence_exercises (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryId         INTEGER NOT NULL,
      englishSentence    TEXT NOT NULL,
      portugueseSentence TEXT NOT NULL,
      verbTense          TEXT NOT NULL DEFAULT '',
      contextTag         TEXT NOT NULL DEFAULT '',
      difficulty         INTEGER NOT NULL DEFAULT 1,
      tip                TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      itemId     INTEGER NOT NULL,
      itemType   TEXT NOT NULL,
      isCorrect  INTEGER NOT NULL DEFAULT 0,
      timestamp  TEXT NOT NULL,
      categoryId INTEGER NOT NULL
    );
  `)
}

function seedIfEmpty(db: Database.Database) {
  const count = (db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number }).c
  if (count > 0) return

  const insertCat = db.prepare(
    'INSERT OR IGNORE INTO categories (id, name, namePT, icon, color, description) VALUES (?,?,?,?,?,?)'
  )
  const insertFC = db.prepare(
    `INSERT INTO flashcards (categoryId, englishText, portugueseText, exampleSentence, exampleTranslation, verbTense, type, difficulty, contextTag)
     VALUES (@categoryId,@englishText,@portugueseText,@exampleSentence,@exampleTranslation,@verbTense,@type,@difficulty,@contextTag)`
  )
  const insertSE = db.prepare(
    `INSERT INTO sentence_exercises (categoryId, englishSentence, portugueseSentence, verbTense, contextTag, difficulty, tip)
     VALUES (@categoryId,@englishSentence,@portugueseSentence,@verbTense,@contextTag,@difficulty,@tip)`
  )

  const seedAll = db.transaction(() => {
    for (const c of CATEGORIES) insertCat.run(c.id, c.name, c.namePT, c.icon, c.color, c.description)
    for (const f of FLASHCARDS) insertFC.run(f)
    for (const e of EXERCISES)  insertSE.run(e)
  })
  seedAll()
}

// ── Categories ────────────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  return getDb().prepare('SELECT * FROM categories ORDER BY id').all() as Category[]
}

// ── Flashcards ────────────────────────────────────────────────────────────────

export function getFlashcards(categoryId?: number): Flashcard[] {
  const db = getDb()
  if (categoryId) {
    return db.prepare('SELECT * FROM flashcards WHERE categoryId = ?').all(categoryId) as Flashcard[]
  }
  return db.prepare('SELECT * FROM flashcards').all() as Flashcard[]
}

export function getFlashcardCount(): number {
  return ((getDb().prepare('SELECT COUNT(*) as c FROM flashcards').get() as { c: number }).c)
}

// ── Sentence Exercises ────────────────────────────────────────────────────────

export function getSentenceExercises(categoryId?: number): SentenceExercise[] {
  const db = getDb()
  if (categoryId) {
    return db.prepare('SELECT * FROM sentence_exercises WHERE categoryId = ?').all(categoryId) as SentenceExercise[]
  }
  return db.prepare('SELECT * FROM sentence_exercises').all() as SentenceExercise[]
}

export function getSentenceCount(): number {
  return ((getDb().prepare('SELECT COUNT(*) as c FROM sentence_exercises').get() as { c: number }).c)
}

// ── Progress ──────────────────────────────────────────────────────────────────

export function recordProgress(itemId: number, itemType: string, isCorrect: boolean, categoryId: number) {
  getDb()
    .prepare('INSERT INTO user_progress (itemId, itemType, isCorrect, timestamp, categoryId) VALUES (?,?,?,?,?)')
    .run(itemId, itemType, isCorrect ? 1 : 0, new Date().toISOString(), categoryId)
}

export function getStats(): Stats {
  const db = getDb()
  const rows = db.prepare('SELECT isCorrect FROM user_progress').all() as { isCorrect: number }[]
  const total = rows.length
  const correct = rows.filter(r => r.isCorrect === 1).length
  const streak = calculateStreak(db)
  return {
    total,
    correct,
    incorrect: total - correct,
    streak,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
  }
}

export function getCategoryStats(): CategoryStats[] {
  const db = getDb()
  const rows = db
    .prepare('SELECT categoryId, isCorrect FROM user_progress')
    .all() as { categoryId: number; isCorrect: number }[]

  const map = new Map<number, { total: number; correct: number }>()
  for (const r of rows) {
    const entry = map.get(r.categoryId) ?? { total: 0, correct: 0 }
    entry.total++
    if (r.isCorrect === 1) entry.correct++
    map.set(r.categoryId, entry)
  }

  return Array.from(map.entries()).map(([categoryId, { total, correct }]) => ({
    categoryId,
    total,
    correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
  }))
}

export function getRecentProgress(count = 20): UserProgress[] {
  return getDb()
    .prepare('SELECT * FROM user_progress ORDER BY timestamp DESC LIMIT ?')
    .all(count) as UserProgress[]
}

export function resetProgress() {
  getDb().prepare('DELETE FROM user_progress').run()
}

function calculateStreak(db: Database.Database): number {
  const rows = db
    .prepare("SELECT DISTINCT date(timestamp, 'localtime') as d FROM user_progress ORDER BY d DESC")
    .all() as { d: string }[]
  if (rows.length === 0) return 0

  const today = new Date().toISOString().slice(0, 10)
  let streak = 0
  let expected = today

  for (const { d } of rows) {
    if (d === expected) {
      streak++
      const prev = new Date(expected)
      prev.setDate(prev.getDate() - 1)
      expected = prev.toISOString().slice(0, 10)
    } else if (d < expected) {
      break
    }
  }
  return streak
}
