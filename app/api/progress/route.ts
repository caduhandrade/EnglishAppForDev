import { NextRequest, NextResponse } from 'next/server'

/**
 * Progress API - Note: Progress is stored in browser IndexedDB
 * These endpoints keep API compatibility but don't store server-side data
 */

export const dynamic = 'force-static'

export function GET() {
  try {
    // Progress is stored client-side in IndexedDB
    // This endpoint returns empty array - client manages progress locally
    return NextResponse.json([])
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Progress is stored client-side in IndexedDB
    // This endpoint acknowledges the request
    return NextResponse.json({ ok: true, stored: 'client-side' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Progress is stored client-side in IndexedDB
    // This endpoint acknowledges the request
    return NextResponse.json({ ok: true, cleared: 'client-side' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
