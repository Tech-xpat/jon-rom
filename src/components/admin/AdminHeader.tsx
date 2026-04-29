'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Zap, LogOut } from 'lucide-react'
import { useAdminAuth } from './AdminAuthProvider'

export default function AdminHeader() {
  const { logout } = useAdminAuth()

  return (
    <header className="bg-gradient-to-r from-black to-gray-900/30 border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Zap size={28} className="text-blue-400" />
          <span className="text-white font-black tracking-widest">ADMIN</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/admin/pricing" className="text-gray-400 hover:text-white text-sm font-bold tracking-widest transition-colors">
            PRICING
          </Link>
          <Link href="/admin/wallets" className="text-gray-400 hover:text-white text-sm font-bold tracking-widest transition-colors">
            WALLETS
          </Link>
          <Link href="/admin/orders" className="text-gray-400 hover:text-white text-sm font-bold tracking-widest transition-colors">
            ORDERS
          </Link>
        </nav>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
        >
          <LogOut size={18} />
          LOGOUT
        </motion.button>
      </div>
    </header>
  )
}
