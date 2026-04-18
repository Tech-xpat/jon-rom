import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: any = null
if (typeof window !== 'undefined') {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
  } catch (e: any) {
    console.error('[Firebase] init error:', e.message)
  }
}

export const auth    = app ? getAuth(app)      : null
export const db      = app ? getFirestore(app) : null
export const storage = app ? getStorage(app)   : null

const googleProvider = app ? new GoogleAuthProvider() : null
if (googleProvider) {
  googleProvider.addScope('profile')
  googleProvider.addScope('email')
  googleProvider.setCustomParameters({ prompt: 'select_account' })
}

if (auth) {
  setPersistence(auth, browserLocalPersistence).catch(() => {})
}

// REDIRECT-ONLY sign-in — avoids all COOP/popup issues on Vercel
export async function signInWithGoogle(): Promise<void> {
  if (!auth || !googleProvider) throw new Error('Firebase not initialized')
  await signInWithRedirect(auth, googleProvider)
}

// Call once on page load to capture redirect result
export async function getGoogleRedirectResult() {
  if (!auth) return null
  try {
    const result = await getRedirectResult(auth)
    return result?.user ?? null
  } catch (e: any) {
    console.error('[Firebase] getRedirectResult:', e.code, e.message)
    return null
  }
}

export async function userSignInWithGoogle(): Promise<void> {
  if (!auth || !googleProvider) throw new Error('Firebase not initialized')
  await signInWithRedirect(auth, googleProvider)
}

export async function signInAnonymouslyUser() {
  if (!auth) throw new Error('Firebase not initialized')
  return signInAnonymously(auth)
}

export function onAuthChange(callback: (user: any) => void) {
  if (!auth) { callback(null); return () => {} }
  return onAuthStateChanged(auth, callback)
}

export async function userSignOut() {
  if (!auth) throw new Error('Firebase not initialized')
  return signOut(auth)
}

export { signOut }
