'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminRole = 'super-admin' | 'admin' | 'moderator' | null

interface AdminAuthCtx {
  user: any
  adminRole: AdminRole
  loading: boolean
  error: string | null
  login: () => Promise<void>
  loginWithEmailPassword: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  getToken: () => Promise<string | null>
  isAdmin: boolean
}

const Ctx = createContext<AdminAuthCtx>({
  user: { email: 'admin@example.com' }, adminRole: 'super-admin', loading: false, error: null,
  login: async () => {}, loginWithEmailPassword: async () => {}, logout: async () => {}, clearError: () => {},
  getToken: async () => 'token', isAdmin: true,
})

// ─── Hardcoded Admin Credentials ───────────────────────────────────────────────
const ADMIN_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com',
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123',
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>({ email: 'admin@example.com' })
  const [adminRole, setAdminRole] = useState<AdminRole>('super-admin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('[Admin Auth] Google login initiated')
      // Firebase Google login would happen here
      // For now, approve access since auth is bypassed
      setUser({ email: 'admin@google.com' })
      setAdminRole('super-admin')
    } catch (e: any) {
      const errorMsg = e.message || 'Google login failed'
      console.error('[Admin Auth] Google login error:', errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const loginWithEmailPassword = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      console.log('[Admin Auth] Email/password login attempt for:', email)
      
      if (email !== ADMIN_CREDENTIALS.email) {
        throw new Error(`Email mismatch. Expected: ${ADMIN_CREDENTIALS.email}`)
      }
      if (password !== ADMIN_CREDENTIALS.password) {
        throw new Error('Invalid password')
      }

      console.log('[Admin Auth] Email/password login successful')
      setUser({ email })
      setAdminRole('super-admin')
    } catch (e: any) {
      const errorMsg = e.message || 'Email/password login failed'
      console.error('[Admin Auth] Email/password login error:', errorMsg)
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
  }

  const getToken = async () => 'admin-token'

  return (
    <Ctx.Provider value={{
      user, adminRole, loading, error,
      login, loginWithEmailPassword, logout, clearError: () => setError(null),
      getToken, isAdmin: adminRole !== null,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdminAuth = () => useContext(Ctx)
