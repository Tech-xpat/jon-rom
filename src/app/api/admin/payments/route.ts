import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Get all pending payments for admin review
  const payments = [
    {
      id: 'pay_1',
      userId: 'user_1',
      userEmail: 'fan@example.com',
      amount: 50,
      fanLevel: 'gold',
      method: 'btc',
      proofUrl: '/images/payment-proof.jpg',
      status: 'pending',
      submittedAt: '2024-04-20T10:30:00Z'
    }
  ]
  return NextResponse.json(payments)
}

export async function POST(req: NextRequest) {
  try {
    const { paymentId, action } = await req.json()
    
    if (action === 'approve') {
      return NextResponse.json({ success: true, message: 'Payment approved, user whitelisted' })
    } else if (action === 'reject') {
      return NextResponse.json({ success: true, message: 'Payment rejected' })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
