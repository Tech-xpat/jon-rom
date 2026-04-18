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
    // Development bypass: allow any signed-in user when explicitly enabled for local testing
    const DEV_ALLOW = process.env.FIREBASE_DEV_ALLOW_ALL === 'true' && process.env.NODE_ENV !== 'production'

    if (!adminAuth || !adminDb) {
      if (DEV_ALLOW) {
        const token = req.headers.get('Authorization')?.replace('Bearer ', '')
        return !!token
      }
      return false
    }
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return false
    const decoded = await adminAuth.verifyIdToken(token)
    const email = (decoded.email || '').toLowerCase().trim()

    if (DEV_ALLOW) return true

    // Case-insensitive check against env-listed emails
    const normalizedList = AUTHORIZED_EMAILS.map((e) => e.toLowerCase().trim())
    if (normalizedList.includes(email)) {
      return true
    }

    // Fallback: check Firestore admins collection (case-insensitive)
    const snap = await adminDb.collection('admins').where('email', '==', email).limit(1).get()
    if (snap.size > 0) return true

    // Also try original-case stored email in Firestore
    const snapOrig = await adminDb.collection('admins').where('email', '==', decoded.email).limit(1).get()
    return snapOrig.size > 0
  } catch {
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
