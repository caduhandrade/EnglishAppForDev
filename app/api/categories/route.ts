import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/data-store'

export const dynamic = 'force-static'

export function GET() {
  try {
    const categories = getCategories()
    return NextResponse.json(categories)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
