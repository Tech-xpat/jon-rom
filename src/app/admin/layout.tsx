import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col sm:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-8 mt-14 sm:mt-0">{children}</div>
      </main>
    </div>
  )
}
