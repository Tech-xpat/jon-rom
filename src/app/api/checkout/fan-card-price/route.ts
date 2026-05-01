import { adminDb } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = adminDb()
    const doc = await db.collection('settings').doc('fanCard').get()

    if (!doc.exists) {
      return NextResponse.json({ price: 2999 }) // Default $29.99 in cents
    }

    const data = doc.data() || {}
    const price = data.price || 2999

    return NextResponse.json({
      price: typeof price === 'number' ? Math.round(price * 100) : price,
    })
  } catch (error: any) {
    console.error('Failed to fetch fan card price:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fan card price', price: 2999 },
      { status: 200 } // Return 200 with default price
    )
  }
}
