'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminAuthProvider, useAdminAuth } from '@/components/admin/AdminAuthProvider'
import AdminSidebar from '@/components/admin/AdminSidebar'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, adminRole, loading, error } = useAdminAuth()
  const router  = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (loading) return
    if (isLoginPage) return
    if (!user) { router.replace('/admin/login'); return }
    if (adminRole === null && error) { 
      // User logged in but not an admin — redirect to login with error
      router.replace('/admin/login')
      return 
    }
  }, [user, adminRole, loading, isLoginPage, router, error])

  // Always show login page immediately
  if (isLoginPage) return <>{children}</>

  // Show spinner while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-xs tracking-[0.3em]">LOADING...</p>
        </div>
      </div>
    )
  }

  // Not authenticated yet — show nothing while redirect fires
  if (!user || (adminRole === null && !error)) return null

  // Authenticated admin — show dashboard
  if (user && adminRole) {
    return (
      <div className="min-h-screen bg-black flex flex-col sm:flex-row">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-8 mt-14 sm:mt-0">{children}</div>
        </main>
      </div>
    )
  }

  return null
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AdminAuthProvider>
  )
}
