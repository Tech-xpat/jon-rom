import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/firestore'

const DEFAULT_PAYMENT_CONFIG = { fanCardAmount: 50 }

export async function GET() {
  try {
    const doc = await getDb().collection('pageSettings').doc('paymentConfig').get()
    return NextResponse.json({ ...DEFAULT_PAYMENT_CONFIG, ...(doc.exists ? doc.data() : {}) })
  } catch (error: any) {
    console.error('Failed to load payment config:', error)
    return NextResponse.json(DEFAULT_PAYMENT_CONFIG, { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { fanCardAmount } = await req.json()
    await getDb().collection('pageSettings').doc('paymentConfig').set({
      fanCardAmount,
      updatedAt: new Date().toISOString(),
    }, { merge: true })

    return NextResponse.json({ success: true, fanCardAmount })
  } catch (error: any) {
    console.error('Failed to save payment config:', error)
    return NextResponse.json({ error: error.message || 'Failed to save payment config' }, { status: 500 })
  }
}
