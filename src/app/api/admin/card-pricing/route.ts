import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/firestore'

const DEFAULT_PRICING = {
  cardBaseFee: 4.99,
  silver: 50,
  gold: 75,
  diamond: 150,
  cashappAccount: '$jonathanroumie',
  cashappName: 'Jonathan Roumie Fan Cards',
  btcAddress: '1A1z7agoat2LWLCZFBX3xCjYjnAEoM81tS',
  usdtAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
}

export async function GET() {
  try {
    const doc = await getDb().collection('pageSettings').doc('cardPricing').get()
    return NextResponse.json({ ...DEFAULT_PRICING, ...(doc.exists ? doc.data() : {}) })
  } catch (error: any) {
    console.error('Failed to load card pricing:', error)
    return NextResponse.json(DEFAULT_PRICING, { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    await getDb().collection('pageSettings').doc('cardPricing').set({
      ...DEFAULT_PRICING,
      ...payload,
      updatedAt: new Date().toISOString(),
    }, { merge: true })

    return NextResponse.json({ success: true, updated: true })
  } catch (error: any) {
    console.error('Failed to save card pricing:', error)
    return NextResponse.json({ error: error.message || 'Failed to save card pricing' }, { status: 500 })
  }
}
