import { createPayment, adminDb } from '@/lib/firestore'
import { verifyUserToken } from '@/lib/auth-utils'
import QRCode from 'qrcode'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    const verified = token ? await verifyUserToken(token) : null

    if (!verified) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currency, amount } = await request.json()

    if (!currency || !amount) {
      return Response.json({ error: 'Currency and amount are required' }, { status: 400 })
    }

    if (!['USDT', 'BTC', 'PayPal', 'Stripe'].includes(currency)) {
      return Response.json({ error: 'Invalid currency' }, { status: 400 })
    }

    // Get user ID
    if (!adminDb) {
      return Response.json({ error: 'Database not initialized' }, { status: 500 })
    }

    const userSnap = await adminDb
      .collection('users')
      .where('email', '==', verified.email)
      .limit(1)
      .get()

    if (userSnap.docs.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = userSnap.docs[0].id

    // Create payment record
    const paymentId = `${currency}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const qrCodeData = JSON.stringify({
      paymentId,
      userId,
      currency,
      amount,
      timestamp: new Date().toISOString(),
    })

    // Generate QR code
    const qrCode = await QRCode.toDataURL(qrCodeData)

    // Save payment to Firestore
    await adminDb.collection('payments').add({
      userId,
      amount,
      currency,
      status: 'pending',
      qrCode,
      transactionId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return Response.json({
      paymentId,
      qrCode,
      message: 'Payment created. Please send funds to the wallet address.',
    })
  } catch (error: any) {
    console.error('Create payment error:', error)
    return Response.json({ error: error.message || 'Failed to create payment' }, { status: 500 })
  }
}
