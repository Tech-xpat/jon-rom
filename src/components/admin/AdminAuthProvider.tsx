'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { auth, signInWithGoogle, getGoogleRedirectResult, userSignOut, onAuthChange } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminRole = 'super-admin' | 'admin' | 'moderator' | null

interface AdminAuthCtx {
  user: User | null
  adminRole: AdminRole
  loading: boolean
  error: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  getToken: () => Promise<string | null>
  isAdmin: boolean
}

const Ctx = createContext<AdminAuthCtx>({
  user: null, adminRole: null, loading: true, error: null,
  login: async () => {}, logout: async () => {}, clearError: () => {},
  getToken: async () => null, isAdmin: false,
})

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null)
  const [adminRole, setAdminRole] = useState<AdminRole>(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const router = useRouter()

  // Helper: call check-role with the user's token
  async function checkRole(u: User): Promise<AdminRole> {
    try {
      const token = await u.getIdToken(true) // force-refresh
      const res = await fetch('/api/admin/check-role', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        return data.role as AdminRole
      }
      const body = await res.json().catch(() => ({}))
      console.error('[Admin] check-role failed:', res.status, body)
      return null
    } catch (e) {
      console.error('[Admin] check-role error:', e)
      return null
    }
  }

  useEffect(() => {
    if (!auth) { setLoading(false); return }

    // 1. Handle redirect result FIRST (fires after Google redirect back to page)
    getGoogleRedirectResult().then(async (redirectUser) => {
      if (redirectUser) {
        console.log('[Admin] Redirect sign-in completed:', redirectUser.email)
        // onAuthStateChanged will fire next and handle the full flow
      }
    })

    // 2. Subscribe to auth state — fires on page load & after redirect
    const unsub = onAuthChange(async (u: User | null) => {
      if (!u) {
        setUser(null)
        setAdminRole(null)
        setLoading(false)
        return
      }

      setUser(u)
      const role = await checkRole(u)
      setAdminRole(role)

      if (role) {
        // Only redirect to /admin if we're currently on the login page
        if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
          router.push('/admin')
        }
      }

      setLoading(false)
    })

    return unsub
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Login: triggers redirect to Google — page will reload on return
  const login = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle() // redirects away — nothing after this runs
    } catch (e: any) {
      setError(e.message || 'Sign-in failed')
      setLoading(false)
    }
  }

  const logout = async () => {
    await userSignOut()
    setUser(null)
    setAdminRole(null)
    router.push('/admin/login')
  }

  const getToken = async (): Promise<string | null> => {
    if (!user) return null
    try { return await user.getIdToken() } catch { return null }
  }

  return (
    <Ctx.Provider value={{
      user, adminRole, loading, error,
      login, logout, clearError: () => setError(null),
      getToken, isAdmin: adminRole !== null,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdminAuth = () => useContext(Ctx)
