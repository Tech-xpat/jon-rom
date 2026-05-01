import { adminDb } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = adminDb()
    const doc = await db.collection('settings').doc('paymentMethods').get()

    if (!doc.exists) {
      return NextResponse.json({
        crypto: { btc: { enabled: false }, usdt: { enabled: false } },
        paypal: { enabled: false },
        stripe: { enabled: false },
        cashapp: { enabled: false },
      })
    }

    const data = doc.data() || {}
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Failed to fetch payment methods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    )
  }
}
