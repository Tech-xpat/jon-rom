'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminAuthProvider, useAdminAuth } from '@/components/admin/AdminAuthProvider'
import AdminSidebar from '@/components/admin/AdminSidebar'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, adminRole, loading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (pathname === '/admin/login') return
    // Not logged in → go to login
    if (!user) { router.push('/admin/login'); return }
    // Logged in but not an admin → go to login with error
    if (adminRole === null) { router.push('/admin/login'); return }
  }, [user, adminRole, loading, pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-jcvd-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-jcvd-gray text-sm tracking-widest">LOADING...</p>
        </div>
      </div>
    )
  }

  if (pathname === '/admin/login') return <>{children}</>

  if (!user || adminRole === null) return null

  return (
    <div className="min-h-screen bg-black flex flex-col sm:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-8 mt-14 sm:mt-0">{children}</div>
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AdminAuthProvider>
  )
}
