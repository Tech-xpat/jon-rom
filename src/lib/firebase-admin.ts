import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function initAdmin() {
  if (getApps().length > 0) return getApps()[0]

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Firebase admin credentials are not fully configured; skipping initAdmin().')
    }
    return null
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  })
}

const adminApp = initAdmin()
export const adminAuth = adminApp ? getAuth(adminApp) : null
export const adminDb = adminApp ? getFirestore(adminApp) : null

// ─── Verify Firebase ID token from Authorization header ──────────────────────
const AUTHORIZED_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',').map((e) => e.trim()).filter(Boolean)

export async function verifyAdminRequest(req: Request): Promise<boolean> {
  try {
    if (!adminAuth) {
      console.error('[Firebase Admin] adminAuth not initialized — check FIREBASE_ADMIN_* env vars on Vercel')
      return false
    }
    const token = req.headers.get('Authorization')?.replace('Bearer ', '').trim()
    if (!token) return false
    // Only verify the token is a valid Firebase ID token — role check is done in check-role route
    await adminAuth.verifyIdToken(token)
    return true
  } catch (err: any) {
    console.error('[Firebase Admin] verifyAdminRequest failed:', err?.code || err?.message)
    return false
  }
}

export async function getDecodedToken(req: Request): Promise<any | null> {
  try {
    if (!adminAuth) return null
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return null
    const decoded = await adminAuth.verifyIdToken(token)
    return decoded
  } catch {
    return null
  }
}
