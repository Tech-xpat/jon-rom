'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { auth, signInWithGoogle, userSignOut, onAuthChange, checkRedirectResult } from '@/lib/firebase'
import { getIdToken, getUserMetadata } from '@/lib/firebase-auth-utils'
import { useRouter } from 'next/navigation'

// Helper function to parse Firebase error codes
function getErrorMessage(err: any): string {
  const code = err?.code || ''
  const message = err?.message || ''

  if (code === 'auth/unauthorized-domain' || message.includes('unauthorized domain')) {
    return 'This domain is not authorized for Google sign-in. Add localhost:3000 (or your domain) in Firebase Console.'
  }

  if (code === 'auth/popup-blocked' || message.includes('popup')) {
    return 'Pop-up was blocked. A redirect sign-in will be used; complete the sign-in when the page reloads.'
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Sign-in was cancelled. Please try again.'
  }

  if (code === 'auth/network-request-failed') {
    return 'Network error during sign-in. Check your connection and try again.'
  }

  if (message.includes('auth/internal-error')) {
    return 'Google sign-in failed. Please try again or contact the administrator.'
  }

  if (message.includes('not initialized') || message.includes('auth/no-token')) {
    return 'Unable to complete sign-in. Please refresh the page and try again.'
  }

  return message || 'Sign-in failed. Please try again.'
}

interface AdminAuthCtx {
  user: User | null
  userMetadata: any | null
  adminRole: 'super-admin' | 'admin' | 'moderator' | null
  loading: boolean
  error: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  getToken: () => Promise<string | null>
  isAdmin: boolean
}

const Ctx = createContext<AdminAuthCtx>({
  user: null,
  userMetadata: null,
  adminRole: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  clearError: () => {},
  getToken: async () => null,
  isAdmin: false,
})

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userMetadata, setUserMetadata] = useState<any | null>(null)
  const [adminRole, setAdminRole] = useState<'super-admin' | 'admin' | 'moderator' | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    // Handle the case where the user was redirected back from Google sign-in.
    // getRedirectResult() must be called before onAuthStateChanged fires to
    // capture the credential returned by the redirect flow.
    checkRedirectResult().then((redirectUser) => {
      // onAuthStateChanged below will fire immediately after and handle the
      // user either way — we don't need to do anything extra here.
      if (redirectUser) {
        console.log('[Admin] Redirect sign-in completed for', redirectUser.email)
      }
    }).catch((e) => console.warn('[Admin] checkRedirectResult error:', e))

    const unsub = onAuthChange(async (u: User | null) => {
      setUser(u)
      if (u) {
        const metadata = getUserMetadata(u)
        setUserMetadata(metadata)
        
        // Check if user is admin
        try {
          const token = await getIdToken(u)
          const response = await fetch('/api/admin/check-role', {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (response.ok) {
            const data = await response.json()
            setAdminRole(data.role)
          } else {
            setAdminRole(null)
          }
        } catch (error) {
          console.error('Failed to check admin role:', error)
          setAdminRole(null)
        }
      } else {
        setUserMetadata(null)
        setAdminRole(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async () => {
    setLoading(true)
    setError(null)

    try {
      const signedUser = await signInWithGoogle()

      // Redirect sign-in in progress — onAuthChange will handle the rest
      if (!signedUser) {
        setLoading(false)
        return
      }

      setUser(signedUser)
      setUserMetadata(getUserMetadata(signedUser))

      const token = await getIdToken(signedUser)
      if (!token) throw new Error('auth/no-token')

      const response = await fetch('/api/admin/check-role', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        setError(
          response.status === 403
            ? `Access denied for ${signedUser.email}. Make sure this email is listed in NEXT_PUBLIC_ADMIN_EMAILS on Vercel.`
            : `Server error (${response.status}): ${body.error || 'check-role failed'}`
        )
        setLoading(false)
        return
      }

      const data = await response.json()
      setAdminRole(data.role)
      router.push('/admin')
    } catch (err: any) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await userSignOut()
      setUser(null)
      setUserMetadata(null)
      router.push('/admin/login')
    } catch (err: any) {
      throw new Error(err.message || 'Logout failed')
    }
  }

  const getToken = async (): Promise<string | null> => {
    if (!user) return null
    return getIdToken(user)
  }

  const clearError = () => setError(null)

  return (
    <Ctx.Provider value={{ 
      user, 
      userMetadata, 
      adminRole,
      loading,
      error,
      login, 
      logout, 
      clearError,
      getToken,
      isAdmin: adminRole !== null
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdminAuth = () => useContext(Ctx)
