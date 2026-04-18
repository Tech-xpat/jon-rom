/**
 * Firebase Test Utilities
 * Helper functions for testing authentication flows during development
 */

import { auth, signInWithGoogle, userSignOut } from './firebase'
import { User } from 'firebase/auth'

/**
 * Get current auth state for debugging
 */
export function debugAuthState() {
  if (!auth) {
    console.log('[Firebase] Auth not initialized')
    return null
  }

  const user = auth.currentUser
  if (!user) {
    console.log('[Firebase] No user signed in')
    return null
  }

  console.log('[Firebase] Current User:', {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    providers: user.providerData.map((p) => p.providerId),
    createdAt: user.metadata.creationTime,
    lastSignIn: user.metadata.lastSignInTime,
  })

  return user
}

/**
 * Get current ID token for debugging
 */
export async function debugGetToken(forceRefresh = false) {
  if (!auth?.currentUser) {
    console.log('[Firebase] No user to get token for')
    return null
  }

  try {
    const token = await auth.currentUser.getIdToken(forceRefresh)
    console.log('[Firebase] ID Token (first 50 chars):', token.substring(0, 50) + '...')
    return token
  } catch (err) {
    console.error('[Firebase] Failed to get token:', err)
    return null
  }
}

/**
 * Get decoded token claims
 */
export async function debugGetTokenClaims() {
  if (!auth?.currentUser) {
    console.log('[Firebase] No user to get claims for')
    return null
  }

  try {
    const tokenResult = await auth.currentUser.getIdTokenResult()
    const authTime = tokenResult.claims.auth_time
    const authTimeNumber = typeof authTime === 'string' ? Number(authTime) : authTime

    console.log('[Firebase] Token Claims:', {
      iss: tokenResult.claims.iss,
      aud: tokenResult.claims.aud,
      auth_time: authTimeNumber ? new Date(authTimeNumber * 1000) : null,
      user_id: tokenResult.claims.sub,
      custom_claims: Object.fromEntries(
        Object.entries(tokenResult.claims).filter(([k]) => !['iss', 'aud', 'auth_time', 'sub'].includes(k))
      ),
    })
    return tokenResult.claims
  } catch (err) {
    console.error('[Firebase] Failed to get claims:', err)
    return null
  }
}

/**
 * Test Google sign-in
 */
export async function testGoogleSignIn() {
  try {
    console.log('[Firebase] Starting Google sign-in test...')
    await signInWithGoogle()
    console.log('[Firebase] Google sign-in initiated - will redirect')
  } catch (err: any) {
    console.error('[Firebase] Google sign-in failed:', err.message)
    throw err
  }
}

/**
 * Test sign-out
 */
export async function testSignOut() {
  try {
    console.log('[Firebase] Starting sign-out test...')
    await userSignOut()
    console.log('[Firebase] Sign-out successful')
  } catch (err: any) {
    console.error('[Firebase] Sign-out failed:', err.message)
    throw err
  }
}

/**
 * Test API authentication
 */
export async function testApiAuth(endpoint: string) {
  try {
    if (!auth?.currentUser) {
      throw new Error('No user signed in')
    }

    console.log(`[Firebase] Testing API auth on ${endpoint}...`)
    const token = await auth.currentUser.getIdToken()

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(`[Firebase] API response status: ${response.status}`)
    const data = await response.json()
    console.log('[Firebase] API response:', data)

    return { status: response.status, data }
  } catch (err: any) {
    console.error('[Firebase] API auth test failed:', err.message)
    throw err
  }
}

/**
 * Log all available auth info
 */
export async function debugFullAuthInfo() {
  console.group('[Firebase] Full Authentication Info')

  // Auth state
  debugAuthState()

  // Token
  await debugGetToken()

  // Token claims
  await debugGetTokenClaims()

  // Check localStorage
  const emailForSignIn = localStorage.getItem('emailForSignIn')
  if (emailForSignIn) {
    console.log('[Firebase] Email for sign-in stored:', emailForSignIn)
  }

  console.groupEnd()
}

/**
 * Quick reference for common test commands
 */
export function printTestCommands() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║           Firebase Authentication Test Commands                ║
╚════════════════════════════════════════════════════════════════╝

In browser console, run:

  // Check current auth state
  debugAuthState()

  // Get current ID token
  await debugGetToken()

  // Get token claims
  await debugGetTokenClaims()

  // Test Google sign-in
  await testGoogleSignIn()

  // Test sign-out
  await testSignOut()

  // Test API authentication
  await testApiAuth('/api/admin/users')

  // Full debug info
  await debugFullAuthInfo()

Import in component:
  import { debugAuthState, testGoogleSignIn } from '@/lib/firebase-test-utils'
`)
}
