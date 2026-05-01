import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest, getDecodedToken } from '@/lib/firebase-admin'
import { getDb } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export interface PaymentMethods {
  crypto: {
    btc: { address: string; enabled: boolean }
    usdt: { address: string; enabled: boolean }
  }
  stripe: {
    publishableKey: string
    enabled: boolean
  }
  paypal: {
    clientId: string
    enabled: boolean
  }
  cashapp: {
    handle: string
    enabled: boolean
  }
  updatedAt: string
  updatedBy: string
}

const DEFAULT_PAYMENT_METHODS: PaymentMethods = {
  crypto: {
    btc: { address: '', enabled: false },
    usdt: { address: '', enabled: false },
  },
  stripe: { publishableKey: '', enabled: false },
  paypal: { clientId: '', enabled: false },
  cashapp: { handle: '', enabled: false },
  updatedAt: new Date().toISOString(),
  updatedBy: '',
}

export async function GET(req: NextRequest) {
  try {
    if (!await verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()
    const doc = await db.collection('settings').doc('paymentMethods').get()
    if (!doc.exists) {
      return NextResponse.json(DEFAULT_PAYMENT_METHODS)
    }

    const data = doc.data() || {}
    return NextResponse.json({ ...DEFAULT_PAYMENT_METHODS, ...data })
  } catch (error: any) {
    console.error('[Payment Methods] GET error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = await getDecodedToken(req)
    const adminEmail = decodedToken?.email || 'admin@example.com'
    const data = await req.json()
    const payload: PaymentMethods = {
      crypto: data.crypto || DEFAULT_PAYMENT_METHODS.crypto,
      stripe: data.stripe || DEFAULT_PAYMENT_METHODS.stripe,
      paypal: data.paypal || DEFAULT_PAYMENT_METHODS.paypal,
      cashapp: data.cashapp || DEFAULT_PAYMENT_METHODS.cashapp,
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail,
    }

    const db = getDb()
    await db.collection('settings').doc('paymentMethods').set(payload, { merge: true })

    console.log('[Payment Methods] Updated successfully by', adminEmail)
    return NextResponse.json({ success: true, message: 'Payment methods updated successfully' })
  } catch (error: any) {
    console.error('[Payment Methods] POST error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update payment methods' }, { status: 500 })
  }
}
