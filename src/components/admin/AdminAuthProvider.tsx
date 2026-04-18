'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminRole = 'super-admin' | 'admin' | 'moderator' | null

interface AdminAuthCtx {
  user: any
  adminRole: AdminRole
  loading: boolean
  error: string | null
  loginWithEmail: (email: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  getToken: () => Promise<string | null>
  isAdmin: boolean
}

const Ctx = createContext<AdminAuthCtx>({
  user: null, adminRole: null, loading: false, error: null,
  loginWithEmail: async () => {}, logout: async () => {}, clearError: () => {},
  getToken: async () => null, isAdmin: false,
})

// ─── Hardcoded Super Admin Emails ─────────────────────────────────────────────
const SUPER_ADMIN_EMAILS = [
  'empiredigitalsworldwide@gmail.com',
  'empiredigitalsceo@gmail.com',
]

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [adminRole, setAdminRole] = useState<AdminRole>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithEmail = async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      console.log('[Admin Auth] Email login attempt:', email)
      
      const normalizedEmail = email.toLowerCase().trim()
      
      // Check if email is in super admin list
      if (!SUPER_ADMIN_EMAILS.includes(normalizedEmail)) {
        throw new Error(`Email not authorized. Only ${SUPER_ADMIN_EMAILS.join(', ')} can access.`)
      }

      console.log('[Admin Auth] Email authorized:', email)
      setUser({ email: normalizedEmail })
      setAdminRole('super-admin')
    } catch (e: any) {
      const errorMsg = e.message || 'Email login failed'
      console.error('[Admin Auth] Login error:', errorMsg)
      setError(errorMsg)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    console.log('[Admin Auth] Logging out')
    setUser(null)
    setAdminRole(null)
    setError(null)
  }

  const getToken = async () => {
    return user ? `admin-${Date.now()}` : null
  }

  return (
    <Ctx.Provider value={{
      user, adminRole, loading, error,
      loginWithEmail, logout, clearError: () => setError(null),
      getToken, isAdmin: adminRole !== null,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdminAuth = () => useContext(Ctx)
