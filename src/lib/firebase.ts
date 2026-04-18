import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

// ─── Firebase Configuration ───────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// ─── Initialize Firebase App ──────────────────────────────────────────────────
let app: any = null

if (typeof window !== 'undefined') {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
  } catch (error: any) {
    console.error('[Firebase] Init error:', error.message)
  }
}

// ─── Firebase Services ────────────────────────────────────────────────────────
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analytics = app && typeof window !== 'undefined'
  ? isSupported().then((supported) => supported ? getAnalytics(app) : null).catch(() => null)
  : null

// ─── Google Auth Provider ─────────────────────────────────────────────────────
export const googleProvider = app ? new GoogleAuthProvider() : null

if (googleProvider) {
  googleProvider.addScope('profile')
  googleProvider.addScope('email')
}

// ─── Auth Persistence ────────────────────────────────────────────────────────
if (auth && typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence)
    .then(() => console.log('[Firebase] Persistence enabled'))
    .catch((err) => console.warn('[Firebase] Persistence warning:', err.message))
}

// ─── Authorized Admin Emails ──────────────────────────────────────────────────
const AUTHORIZED_EMAILS: string[] = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS || ''
).split(',').map((e) => e.trim()).filter(Boolean)

// ─── Google Sign In (Admin only) ──────────────────────────────────────────────
export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase auth is not initialized')
  if (!googleProvider) throw new Error('Google provider not configured')

  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (err: any) {
    const msg = err?.message || ''
    const code = err?.code || ''
    // If popup is blocked or not allowed in this environment, fall back to redirect
    if (code === 'auth/popup-blocked' || msg.includes('popup')) {
      try {
        await signInWithRedirect(auth, googleProvider)
        // Redirect will take over the flow; return null to indicate redirect in progress
        return null
      } catch (redirErr: any) {
        throw redirErr
      }
    }
    throw err
  }
}

// ─── User Google Sign In ───────────────────────────────────────────────────────
export async function userSignInWithGoogle() {
  if (!auth) throw new Error('Firebase auth is not initialized')
  if (!googleProvider) throw new Error('Google provider not configured')
  return signInWithPopup(auth, googleProvider)
}

// ─── Anonymous Sign In ─────────────────────────────────────────────────────────
export async function signInAnonymouslyUser() {
  if (!auth) throw new Error('Firebase auth is not initialized')
  try {
    return await signInAnonymously(auth)
  } catch (error: any) {
    console.error('[Firebase] Anonymous sign-in error:', error.code, error.message)
    throw error
  }
}

// ─── Auth State Changes ────────────────────────────────────────────────────────
export function onAuthChange(callback: (user: any) => void) {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

// ─── Sign Out ──────────────────────────────────────────────────────────────────
export async function userSignOut() {
  if (!auth) throw new Error('Firebase auth is not initialized')
  return signOut(auth)
}

export { signOut }
