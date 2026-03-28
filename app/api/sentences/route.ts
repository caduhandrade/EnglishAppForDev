import { NextRequest, NextResponse } from 'next/server'
import { getSentenceExercises } from '@/lib/data-store'

export function GET(req: NextRequest) {
  try {
    const catId = req.nextUrl.searchParams.get('categoryId')
    const sentences = getSentenceExercises(catId ? Number(catId) : undefined)
    return NextResponse.json(sentences)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
