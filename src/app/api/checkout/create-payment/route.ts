import { createPayment, getCryptoWallets, getUserByEmail, createUser, adminDb } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, name, currency, amount } = await request.json()

    if (!email || !currency || !amount) {
      return Response.json({ error: 'Email, currency, and amount are required' }, { status: 400 })
    }

    if (!['USDT', 'BTC'].includes(currency)) {
      return Response.json({ error: 'Invalid currency — only USDT and BTC are accepted' }, { status: 400 })
    }

    if (!adminDb) {
      return Response.json({ error: 'Database not initialized' }, { status: 500 })
    }

    // Verify wallet is configured for this currency
    const wallets = await getCryptoWallets()
    const wallet = wallets.find((w) => w.type === currency)
    if (!wallet?.address) {
      return Response.json({ error: `No ${currency} wallet configured. Please contact support.` }, { status: 400 })
    }

    // Find or create user record by email (userId is optional until Google sign-in)
    let user = await getUserByEmail(email)
    if (!user) {
      user = await createUser(email)
    }

    // Create the pending payment record
    const payment = await createPayment({
      userId: user.id,
      email: email.toLowerCase().trim(),
      name: name?.trim() || '',
      amount,
      currency,
      status: 'pending',
    })

    return Response.json({
      paymentId: payment.id,
      message: 'Payment submitted. Admin will verify and whitelist you within 24 hours.',
    })
  } catch (error: any) {
    console.error('Create payment error:', error)
    return Response.json({ error: error.message || 'Failed to submit payment' }, { status: 500 })
  }
}