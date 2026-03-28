import { NextResponse } from 'next/server'
import { getFlashcardCount, getSentenceCount } from '@/lib/data-store'

export const dynamic = 'force-static'

export function GET() {
  try {
    // User progress stats are stored client-side in IndexedDB
    // This endpoint returns static content counts and empty progress stats
    const stats = {
      total: 0,
      correct: 0,
      incorrect: 0,
      streak: 0,
      accuracy: 0,
    }
    const categoryStats: any[] = []
    const flashcardCount = getFlashcardCount()
    const sentenceCount = getSentenceCount()
    return NextResponse.json({ ...stats, categoryStats, flashcardCount, sentenceCount })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
