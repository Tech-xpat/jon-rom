'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminAuthProvider, useAdminAuth } from '@/components/admin/AdminAuthProvider'
import AdminSidebar from '@/components/admin/AdminSidebar'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [user, loading, pathname, router])

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

  if (!user && pathname !== '/admin/login') return null

  if (pathname === '/admin/login') return <>{children}</>

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
