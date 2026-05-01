import { adminDb } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = adminDb // ✅ FIXED (no parentheses)

    const snapshot = await db.collection('productPrices').get()

    if (snapshot.empty) {
      // Return fallback products based on default prices
      return NextResponse.json([
        {
          id: 'fan-card',
          name: 'Jonathan Roumie Fan Card',
          description: 'Exclusive personalized fan card with your name',
          price: 29.99,
          image: '/images/hero/download (6).jfif',
          category: 'cards',
        },
        {
          id: 'merchandise',
          name: 'Exclusive Merchandise Bundle',
          description: 'Limited edition Jonathan Roumie merchandise',
          price: 49.99,
          image: '/images/hero/download (6).jfif',
          category: 'merchandise',
        },
        {
          id: 'vip-pass',
          name: 'VIP Event Pass',
          description: 'Access to exclusive VIP events and meet-and-greets',
          price: 99.99,
          image: '/images/hero/download (6).jfif',
          category: 'events',
        },
      ])
    }

    const products = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || 'Unnamed Product',
        description: data.description || '',
        price: typeof data.price === 'number'
          ? Number((data.price / 100).toFixed(2)) // 👈 small fix: keep it a number
          : data.price || 0,
        image: data.image || '/images/hero/download (6).jfif',
        category: data.category || 'general',
      }
    })

    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Failed to fetch products:', error)

    // Return fallback products on error
    return NextResponse.json([
      {
        id: 'fan-card',
        name: 'Jonathan Roumie Fan Card',
        description: 'Exclusive personalized fan card with your name',
        price: 29.99,
        image: '/images/hero/download (6).jfif',
        category: 'cards',
      },
      {
        id: 'merchandise',
        name: 'Exclusive Merchandise Bundle',
        description: 'Limited edition Jonathan Roumie merchandise',
        price: 49.99,
        image: '/images/hero/download (6).jfif',
        category: 'merchandise',
      },
      {
        id: 'vip-pass',
        name: 'VIP Event Pass',
        description: 'Access to exclusive VIP events and meet-and-greets',
        price: 99.99,
        image: '/images/hero/download (6).jfif',
        category: 'events',
      },
    ])
  }
}
