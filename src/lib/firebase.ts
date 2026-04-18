'use client'

import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
  signInAnonymously,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  UserCredential,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: any = null

if (typeof window !== 'undefined') {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
}

// Prefer popup sign-in to avoid redirect loops in dev; redirect remains available.
export const signInWithGoogle = loginWithGooglePopup
export const getGoogleRedirectResult = handleRedirectResult

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null

const provider = app ? new GoogleAuthProvider() : null

if (provider) {
  provider.setCustomParameters({ prompt: 'select_account' })
}

if (auth) {
  setPersistence(auth, browserLocalPersistence).catch(() => {})
}

// 🔥 ONLY ONE LOGIN FUNCTION
export async function loginWithGoogleRedirect(): Promise<void> {
  if (!auth || !provider) throw new Error('Firebase not initialized')
  await signInWithRedirect(auth, provider)
}

// Popup-based sign-in (less likely to cause redirect loops in some browsers)
export async function loginWithGooglePopup(): Promise<void> {
  if (!auth || !provider) throw new Error('Firebase not initialized')
  await signInWithPopup(auth, provider)
}

// 🔥 OPTIONAL (only if you want redirect result debugging)
export async function handleRedirectResult(): Promise<UserCredential | null> {
  if (!auth) return null
  return await getRedirectResult(auth)
}

export function onAuthChange(callback: (user: any) => void) {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

export async function userSignOut() {
  if (!auth) throw new Error('Firebase not initialized')
  return signOut(auth)
}

export async function signInAnonymouslyUser() {
  if (!auth) throw new Error('Firebase not initialized')
  return signInAnonymously(auth)
}
