import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest, getDecodedToken } from '@/lib/firebase-admin'
import { getAdmin, createAdmin } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

// Admin emails allowed via environment variable (bootstrap access)
const ENV_ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

// Hardcoded super-admin — always resolves as super-admin
const SUPER_ADMINS: Record<string, 'super-admin'> = {
  'empiredigitalsworldwide@gmail.com': 'super-admin',
}

export async function GET(req: NextRequest) {
  if (!await verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decodedToken = await getDecodedToken(req)
    if (!decodedToken?.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const email = (decodedToken.email || '').toLowerCase().trim()

    // Hardcoded super-admin — bypass Firestore entirely
    if (SUPER_ADMINS[email]) {
      return NextResponse.json({ role: SUPER_ADMINS[email] })
    }

    // Check Firestore for other admins
    let admin = await getAdmin(email)

    // Auto-provision env-listed emails
    if (!admin && ENV_ADMIN_EMAILS.includes(email)) {
      admin = await createAdmin(email, 'super-admin')
    }

    if (!admin) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    return NextResponse.json({ role: admin.role })
  } catch (error) {
    console.error('Failed to check admin role:', error)
    return NextResponse.json({ error: 'Failed to check admin role' }, { status: 500 })
  }
}