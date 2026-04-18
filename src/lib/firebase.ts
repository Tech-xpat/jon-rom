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
  getRedirectResult,
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
  // Force account selection every time so the right admin email is chosen
  googleProvider.setCustomParameters({ prompt: 'select_account' })
}

// ─── Auth Persistence ─────────────────────────────────────────────────────────
if (auth && typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) =>
    console.warn('[Firebase] Persistence warning:', err.message)
  )
}

// ─── Check for redirect result (called on page load after redirect sign-in) ───
export async function checkRedirectResult() {
  if (!auth) return null
  try {
    const result = await getRedirectResult(auth)
    return result?.user ?? null
  } catch (err: any) {
    console.error('[Firebase] getRedirectResult error:', err.code, err.message)
    return null
  }
}

// ─── Google Sign In ───────────────────────────────────────────────────────────
// Returns the signed-in User on success.
// Returns null if a redirect was initiated (page will reload).
// Throws on unrecoverable errors.
export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase auth is not initialized')
  if (!googleProvider) throw new Error('Google provider not configured')

  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (err: any) {
    const code = err?.code || ''
    const msg  = err?.message || ''

    // These errors mean the popup was blocked or killed by COOP headers —
    // fall through to redirect sign-in automatically.
    const needsRedirect =
      code === 'auth/popup-blocked' ||
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      msg.includes('Cross-Origin-Opener-Policy') ||
      msg.includes('popup')

    if (needsRedirect) {
      await signInWithRedirect(auth, googleProvider)
      return null // page will reload; onAuthChange will pick up the result
    }

    throw err
  }
}

// ─── User Google Sign In (public-facing, separate from admin) ─────────────────
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
