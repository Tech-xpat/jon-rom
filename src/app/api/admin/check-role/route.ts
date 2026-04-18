import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

// ── Hardcoded super-admin — always has access no matter what ──────────────────
const HARDCODED_SUPER_ADMINS = [
  'empiredigitalsworldwide@gmail.com',
  'empiredigitalsceo@gmail.com',
]

// ── Env-listed admins (comma-separated in Vercel env vars) ────────────────────
const ENV_ADMINS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)

export async function GET(req: NextRequest) {
  try {
    // 1. Extract bearer token
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()

    if (!token || token === 'null' || token === 'undefined') {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // 2. Verify token with Firebase Admin
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Server misconfiguration: Firebase Admin not initialized. Check FIREBASE_ADMIN_* env vars on Vercel.' },
        { status: 500 }
      )
    }

    let decoded: any
    try {
      decoded = await adminAuth.verifyIdToken(token)
    } catch (e: any) {
      console.error('[check-role] verifyIdToken failed:', e.code, e.message)
      return NextResponse.json(
        { error: `Invalid token: ${e.code || e.message}` },
        { status: 401 }
      )
    }

    const email = (decoded.email || '').toLowerCase().trim()

    if (!email) {
      return NextResponse.json({ error: 'Token has no email claim' }, { status: 401 })
    }

    // 3. Hardcoded super-admin — bypass everything
    if (HARDCODED_SUPER_ADMINS.includes(email)) {
      return NextResponse.json({ role: 'super-admin', email })
    }

    // 4. Env-listed admins — auto-provision in Firestore then allow
    if (ENV_ADMINS.includes(email)) {
      if (adminDb) {
        const snap = await adminDb.collection('admins').where('email', '==', email).limit(1).get()
        if (snap.empty) {
          await adminDb.collection('admins').add({
            email, role: 'super-admin', verified: true,
            createdAt: new Date().toISOString(),
          })
        }
      }
      return NextResponse.json({ role: 'super-admin', email })
    }

    // 5. Check Firestore admins collection (case-insensitive)
    if (adminDb) {
      const snap = await adminDb.collection('admins').where('email', '==', email).limit(1).get()
      if (!snap.empty) {
        const data = snap.docs[0].data()
        return NextResponse.json({ role: data.role || 'admin', email })
      }
    }

    // 6. Not an admin
    console.warn('[check-role] Access denied for:', email)
    return NextResponse.json(
      { error: `${email} is not authorized. Add this email to NEXT_PUBLIC_ADMIN_EMAILS in Vercel.` },
      { status: 403 }
    )

  } catch (e: any) {
    console.error('[check-role] Unexpected error:', e)
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 })
  }
}
