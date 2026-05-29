import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest, getDecodedToken } from '@/lib/firebase-admin'
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

// GET all product prices from the canonical products collection.
export async function GET(req: NextRequest) {
  try {
    if (!await verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()
    const snap = await db.collection('products').orderBy('createdAt', 'desc').get()
    const products = snap.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Record<string, any>),
      price: typeof doc.data().price === 'number' ? doc.data().price : Number(doc.data().price || 0),
    }))

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

    const decodedToken = await getDecodedToken(req)
    const adminEmail = decodedToken?.email || 'admin'
    const { productId, price, name, category, description } = await req.json()

    if (!productId || price === undefined) {
      return NextResponse.json({ error: 'productId and price are required' }, { status: 400 })
    }

    const db = getDb()
    const existing = await db.collection('products').doc(productId).get()
    const payload = {
      name: name || existing.data()?.name || productId,
      price: Math.round(price * 100), // Convert to cents
      category: category || existing.data()?.category || 'general',
      description: description || existing.data()?.description || '',
      inStock: existing.data()?.inStock ?? true,
      image: existing.data()?.image || '/images/shop/WhatsApp_Image_2026-04-23_at_19.13.27.jpeg',
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail,
    }

    await db.collection('products').doc(productId).set(payload, { merge: true })

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

    const decodedToken = await getDecodedToken(req)
    const adminEmail = decodedToken?.email || 'admin'
    const { price } = await req.json()

    if (price === undefined) {
      return NextResponse.json({ error: 'price is required' }, { status: 400 })
    }

    const db = getDb()
    await db.collection('pageSettings').doc('fanCard').set({
      price: Math.round(price * 100),
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail,
    }, { merge: true })

    console.log(`[Fan Card Price] Updated to ${price} by ${adminEmail}`)
    return NextResponse.json({ success: true, message: 'Fan card price updated', price: Math.round(price * 100) })
  } catch (error: any) {
    console.error('[Fan Card Price] PUT error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update fan card price' }, { status: 500 })
  }
}
