import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const pricing = {
    silver: 50,
    gold: 75,
    diamond: 150,
    cashappAccount: '1234567890',
    cashappName: 'Jonathan Roumie Fan Cards',
    btcAddress: '1A1z7agoat2LWLCZFBX3xCjYjnAEoM81tS',
    usdtAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
  }
  return NextResponse.json(pricing)
}

export async function POST(req: NextRequest) {
  try {
    const { silver, gold, diamond, cashappAccount, cashappName, btcAddress, usdtAddress } = await req.json()
    return NextResponse.json({ success: true, updated: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
