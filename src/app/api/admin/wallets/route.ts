import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/firebase-admin'
import { getCryptoWallets } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!await verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const walletsData = await getCryptoWallets()
    return NextResponse.json({
      btc: walletsData.btc || null,
      usdt: walletsData.usdt || null,
    })
  } catch (error: any) {
    console.error('Get wallets error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get wallets' }, { status: 500 })
  }
}
