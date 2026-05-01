import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = getDb()
    const doc = await db.collection('settings').doc('paymentMethods').get()

    if (!doc.exists) {
      return NextResponse.json({
        crypto: { btc: { address: '', enabled: false }, usdt: { address: '', enabled: false } },
        paypal: { clientId: '', enabled: false },
        stripe: { publishableKey: '', enabled: false },
        cashapp: { handle: '', enabled: false },
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
