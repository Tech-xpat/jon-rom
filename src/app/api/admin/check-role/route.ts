import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ─── Authorized Super Admin Emails ────────────────────────────────────────────
const SUPER_ADMIN_EMAILS = [
  'empiredigitalsworldwide@gmail.com',
  'empiredigitalsceo@gmail.com',
]

export async function GET(req: NextRequest) {
  try {
    // Extract email from query params or header
    const email = (req.nextUrl.searchParams.get('email') || '').trim().toLowerCase()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Check if email is authorized
    if (SUPER_ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ 
        role: 'super-admin', 
        email,
        authorized: true 
      })
    }

    // Email not authorized
    console.warn('[check-role] Unauthorized access attempt:', email)
    return NextResponse.json(
      { error: 'Email not authorized for admin access', authorized: false },
      { status: 403 }
    )
  } catch (e: any) {
    console.error('[check-role] Error:', e.message)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
