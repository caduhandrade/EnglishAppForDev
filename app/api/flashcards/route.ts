import { NextRequest, NextResponse } from 'next/server'
import { getFlashcards } from '@/lib/data-store'

export const dynamic = 'force-static'

export function GET(req: NextRequest) {
  try {
    const catId = req.nextUrl.searchParams.get('categoryId')
    const flashcards = getFlashcards(catId ? Number(catId) : undefined)
    return NextResponse.json(flashcards)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
