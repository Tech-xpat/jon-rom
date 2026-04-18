import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/firebase-admin'
import { confirmPayment, getPayment, updateUser } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!await verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { paymentId, transactionId } = await req.json()

    if (!paymentId || !transactionId) {
      return NextResponse.json(
        { error: 'Payment ID and Transaction ID are required' },
        { status: 400 }
      )
    }

    const payment = await getPayment(paymentId)
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    await confirmPayment(paymentId, transactionId)

    if (payment.userId) {
      await updateUser(payment.userId, { paymentStatus: 'confirmed' })
    }

    return NextResponse.json({ success: true, message: 'Payment confirmed successfully' })
  } catch (error: any) {
    console.error('Confirm payment error:', error)
    return NextResponse.json({ error: error.message || 'Failed to confirm payment' }, { status: 500 })
  }
}
