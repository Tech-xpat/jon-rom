import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/firebase-admin'
import { getDb } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export interface ProductPrice {
  id: string
  name: string
  price: number // in cents
  category: string
  description: string
  updatedAt: string
}

// GET all product prices
export async function GET(req: NextRequest) {
  try {
    if (!await verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()
    const snap = await db.collection('productPrices').orderBy('name').get()
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    return NextResponse.json(products)
  } catch (error: any) {
    console.error('[Product Prices] GET error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

// UPDATE product price
export async function POST(req: NextRequest) {
  try {
    if (!await verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminEmail = req.headers.get('x-admin-email') || 'admin'
    const { productId, price, name, category, description } = await req.json()

    if (!productId || price === undefined) {
      return NextResponse.json({ error: 'productId and price are required' }, { status: 400 })
    }

    const db = getDb()
    const payload = {
      name: name || productId,
      price: Math.round(price * 100), // Convert to cents
      category: category || 'general',
      description: description || '',
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail,
    }

    await db.collection('productPrices').doc(productId).set(payload, { merge: true })

    console.log(`[Product Prices] Updated ${productId} by ${adminEmail}`)
    return NextResponse.json({ success: true, message: 'Product price updated' })
  } catch (error: any) {
    console.error('[Product Prices] POST error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update price' }, { status: 500 })
  }
}

// UPDATE fan card price specifically
export async function PUT(req: NextRequest) {
  try {
    if (!await verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminEmail = req.headers.get('x-admin-email') || 'admin'
    const { price } = await req.json()

    if (price === undefined) {
      return NextResponse.json({ error: 'price is required' }, { status: 400 })
    }

    const db = getDb()
    await db.collection('settings').doc('fanCard').update({
      price: Math.round(price * 100),
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail,
    })

    console.log(`[Fan Card Price] Updated to ${price} by ${adminEmail}`)
    return NextResponse.json({ success: true, message: 'Fan card price updated', price: Math.round(price * 100) })
  } catch (error: any) {
    console.error('[Fan Card Price] PUT error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update fan card price' }, { status: 500 })
  }
}
