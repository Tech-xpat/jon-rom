import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { verifyAdminRequest } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// In-memory store for shop orders (in production, use a database)
let shopOrders: any[] = []

export async function GET(req: NextRequest) {
  if (!await verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get Stripe orders (fan card orders)
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.payment_intent'],
    })

    const stripeOrders = sessions.data
      .filter((s) => s.payment_status === 'paid')
      .map((s) => {
        const pi = s.payment_intent as Stripe.PaymentIntent | null
        return {
          id: s.id,
          amount: s.amount_total ?? 0,
          currency: s.currency ?? 'usd',
          status: pi?.status ?? s.payment_status,
          customer_email: s.customer_details?.email ?? null,
          product: s.metadata?.product ?? 'fan-card',
          type: 'fan-card',
          created: s.created,
        }
      })

    // Combine shop orders and Stripe orders
    const allOrders = [...shopOrders, ...stripeOrders]
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.amount || 0), 0)

    return NextResponse.json({ orders: allOrders, totalRevenue })
  } catch (error) {
    console.error('Orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, total, customer, paymentMethod, cryptoType, cryptoWallet, timestamp } = body

    // Create new order
    const newOrder = {
      id: `SHOP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'shop',
      items,
      amount: Math.round(total * 100), // Store in cents like Stripe
      currency: 'usd',
      status: 'pending-payment',
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_address: customer.address,
      customer_alt_phone: customer.altPhone,
      payment_method: paymentMethod,
      crypto_type: cryptoType,
      crypto_wallet: cryptoWallet,
      created: Math.floor(new Date(timestamp).getTime() / 1000),
      product: 'merchandise',
    }

    shopOrders.push(newOrder)

    // Send email notification to admin
    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.ADMIN_EMAIL || 'admin@example.com',
          subject: `NEW ORDER: ${newOrder.id}`,
          html: `
            <h2>New Shop Order Received</h2>
            <p><strong>Order ID:</strong> ${newOrder.id}</p>
            <p><strong>Customer Email:</strong> ${customer.email}</p>
            <p><strong>Customer Phone:</strong> ${customer.phone}</p>
            <p><strong>Address:</strong> ${customer.address}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
            <p><strong>Items:</strong></p>
            <ul>
              ${items.map((item: any) => `<li>${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
            </ul>
          `,
        }),
      })
    } catch (emailError) {
      console.log('Email notification skipped (email service may not be configured)')
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      message: 'Order received. Awaiting payment confirmation.',
    })
  } catch (error) {
    console.error('Order submission error:', error)
    return NextResponse.json({ error: 'Failed to submit order' }, { status: 500 })
  }
}
