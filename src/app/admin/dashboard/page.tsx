'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  RefreshCw,
  Settings,
  AlertCircle,
} from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import AdminHeader from '@/components/admin/AdminHeader'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  activeCustomers: number
  conversionRate: number
}

export default function AdminDashboard() {
  const { isAdmin } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 12450.50,
    totalOrders: 156,
    activeCustomers: 89,
    conversionRate: 3.2,
  })
  const [loading, setLoading] = useState(false)

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Admin access required</p>
      </div>
    )
  }

  const statCards = [
    {
      label: 'TOTAL REVENUE',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-600/20 to-green-900/20',
      borderColor: 'border-green-500/50',
    },
    {
      label: 'TOTAL ORDERS',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-blue-600/20 to-blue-900/20',
      borderColor: 'border-blue-500/50',
    },
    {
      label: 'ACTIVE USERS',
      value: stats.activeCustomers,
      icon: Users,
      color: 'from-purple-600/20 to-purple-900/20',
      borderColor: 'border-purple-500/50',
    },
    {
      label: 'CONVERSION RATE',
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: 'from-orange-600/20 to-orange-900/20',
      borderColor: 'border-orange-500/50',
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-white text-4xl font-black tracking-widest mb-6">ADMIN DASHBOARD</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'CENTRAL SETTINGS', href: '/admin/settings', icon: Settings },
              { label: 'PAYMENTS', href: '/admin/payments', icon: DollarSign },
              { label: 'ORDERS', href: '/admin/orders', icon: BarChart3 },
              { label: 'USERS', href: '/admin/users', icon: ShoppingCart },
            ].map((item, idx) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-white/40 rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:bg-white/15 cursor-pointer"
              >
                <item.icon size={32} className="text-blue-400" />
                <span className="text-white font-bold tracking-widest text-center">{item.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {statCards.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className={`bg-gradient-to-br ${stat.color} border ${stat.borderColor} rounded-2xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon size={24} className="text-white" />
                  <span className="text-gray-400 text-xs tracking-widest font-bold">{stat.label}</span>
                </div>
                <p className="text-white text-3xl font-black">{stat.value}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Admin Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-900/20 to-blue-900/10 border border-blue-500/50 rounded-2xl p-6 flex items-start gap-4"
        >
          <AlertCircle size={24} className="text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-bold mb-2">ADMIN STATUS</h3>
            <p className="text-gray-400 text-sm">
              You are logged in as an administrator. Use the central settings page to manage pricing, payment handles, product prices, and admin access from one route. All changes are applied in real-time.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
