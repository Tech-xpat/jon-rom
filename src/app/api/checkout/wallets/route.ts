import { getCryptoWallets } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const wallets = await getCryptoWallets()
    const btc = wallets.find((w) => w.type === 'BTC')
    const usdt = wallets.find((w) => w.type === 'USDT')

    return Response.json({
      btc: btc ? { address: btc.address } : null,
      usdt: usdt ? { address: usdt.address } : null,
    })
  } catch (error: any) {
    console.error('Get wallets error:', error)
    return Response.json({ error: error.message || 'Failed to get wallets' }, { status: 500 })
  }
}
