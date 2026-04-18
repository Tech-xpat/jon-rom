'use client'

import { createContext, useContext, ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminRole = 'super-admin' | 'admin' | 'moderator' | null

interface AdminAuthCtx {
  user: any
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
  user: { email: 'admin@example.com' }, adminRole: 'super-admin', loading: false, error: null,
  login: async () => {}, logout: async () => {}, clearError: () => {},
  getToken: async () => 'token', isAdmin: true,
})

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const user = { email: 'admin@example.com' }
  const adminRole: AdminRole = 'super-admin'
  const loading = false
  const error: string | null = null

  const login = async () => {}
  const logout = async () => {}
  const getToken = async () => 'token'

  return (
    <Ctx.Provider value={{
      user, adminRole, loading, error,
      login, logout, clearError: () => {},
      getToken, isAdmin: adminRole !== null,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdminAuth = () => useContext(Ctx)
