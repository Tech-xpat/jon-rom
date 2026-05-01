import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/firebase-admin'
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

// GET all payment methods
export async function GET(req: NextRequest) {
  try {
    if (!await verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()
    const doc = await db.collection('settings').doc('paymentMethods').get()
    
    if (doc.exists) {
      return NextResponse.json(doc.data())
    }

    // Return default if not found
    return NextResponse.json({
      crypto: { btc: { address: '', enabled: false }, usdt: { address: '', enabled: false } },
      stripe: { publishableKey: '', enabled: false },
      paypal: { clientId: '', enabled: false },
      cashapp: { handle: '', enabled: false },
      updatedAt: new Date().toISOString(),
      updatedBy: '',
    })
  } catch (error: any) {
    console.error('[Payment Methods] GET error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

// UPDATE payment methods
export async function POST(req: NextRequest) {
  try {
    if (!await verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminEmail = req.headers.get('x-admin-email') || 'admin@example.com'
    const data = await req.json()

    const db = getDb()
    const payload: PaymentMethods = {
      crypto: data.crypto || { btc: { address: '', enabled: false }, usdt: { address: '', enabled: false } },
      stripe: data.stripe || { publishableKey: '', enabled: false },
      paypal: data.paypal || { clientId: '', enabled: false },
      cashapp: data.cashapp || { handle: '', enabled: false },
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail,
    }

    await db.collection('settings').doc('paymentMethods').set(payload, { merge: true })

    console.log('[Payment Methods] Updated successfully by', adminEmail)
    return NextResponse.json({ success: true, message: 'Payment methods updated successfully' })
  } catch (error: any) {
    console.error('[Payment Methods] POST error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update payment methods' }, { status: 500 })
  }
}
