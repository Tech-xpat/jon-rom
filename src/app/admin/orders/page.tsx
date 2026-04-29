'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, CreditCard, RefreshCw, Eye, Copy, Check, X, Mail, Phone } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'

interface Order {
  id: string
  amount: number
  currency: string
  status: string
  customer_email: string | null
  customer_phone?: string
  customer_address?: string
  customer_alt_phone?: string
  payment_method?: string
  product: string
  type?: string
  items?: any[]
  created: number
}

export default function AdminOrdersPage() {
  const { getToken } = useAdminAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set())

  async function load() {
    setLoading(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
        setTotalRevenue(data.totalRevenue || 0)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleRevealField = (fieldId: string) => {
    const newSet = new Set(revealedFields)
    if (newSet.has(fieldId)) {
      newSet.delete(fieldId)
    } else {
      newSet.add(fieldId)
    }
    setRevealedFields(newSet)
  }

  const handleCopyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldId)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@')
    return `${name[0]}***${name[name.length - 1]}@${domain}`
  }

  const maskPhone = (phone: string) => {
    return `***-***-${phone.slice(-4)}`
  }

  const statusColor = (s: string) => ({
    succeeded: 'text-green-400 bg-green-900/30',
    pending: 'text-yellow-400 bg-yellow-900/30',
    failed: 'text-red-400 bg-red-900/30',
  }[s] || 'text-gray-400 bg-white/5')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-black tracking-widest">ORDERS</h1>
          <p className="text-gray-500 text-sm mt-1">Shop orders & Fan card purchases</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-sm transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/3 border border-white/5 rounded-2xl p-6">
          <ShoppingBag size={20} className="text-red-400 mb-2" />
          <p className="text-white text-2xl font-black">{orders.length}</p>
          <p className="text-gray-500 text-xs tracking-widest mt-1">TOTAL ORDERS</p>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-2xl p-6">
          <CreditCard size={20} className="text-green-400 mb-2" />
          <p className="text-white text-2xl font-black">${(totalRevenue / 100).toFixed(2)}</p>
          <p className="text-gray-500 text-xs tracking-widest mt-1">TOTAL REVENUE</p>
        </div>
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/3 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <ShoppingBag size={40} className="mx-auto mb-4 opacity-30" />
          <p className="tracking-widest text-sm">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/3 border border-white/5 rounded-2xl overflow-hidden hover:bg-white/4 transition-colors cursor-pointer"
              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
            >
              {/* Order Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs tracking-widest">ORDER ID</p>
                      <p className="text-white font-mono text-sm">{order.id.slice(-8)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs tracking-widest">TYPE</p>
                      <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        order.type === 'shop' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'
                      }`}>
                        {order.type === 'shop' ? 'SHOP' : 'FAN-CARD'}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs tracking-widest">AMOUNT</p>
                      <p className="text-white font-bold">${(order.amount / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs tracking-widest">STATUS</p>
                      <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 font-bold ${statusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ rotate: 180 }}
                  className="ml-4 text-gray-400 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                  }}
                >
                  <Eye size={20} />
                </motion.button>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedOrderId === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/5 p-4 space-y-4 bg-black/30"
                  >
                    {/* Product & Payment Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-400 text-xs tracking-widest mb-2">PRODUCT</p>
                        <p className="text-white">{order.product}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs tracking-widest mb-2">PAYMENT METHOD</p>
                        <span className={`text-xs px-3 py-1.5 rounded-full inline-block font-bold ${
                          order.payment_method === 'crypto' ? 'bg-yellow-900/30 text-yellow-400' :
                          order.payment_method === 'cashapp' ? 'bg-green-900/30 text-green-400' :
                          order.payment_method === 'venmo' ? 'bg-blue-900/30 text-blue-400' :
                          'bg-gray-900/30 text-gray-400'
                        }`}>
                          {order.payment_method ? order.payment_method.toUpperCase() : 'UNKNOWN'}
                        </span>
                      </div>
                    </div>

                    {/* Customer Details - Hidden until revealed */}
                    <div className="bg-black/50 rounded-lg p-4 space-y-3 border border-white/10">
                      <p className="text-gray-400 text-xs tracking-widest font-bold mb-3">CUSTOMER DETAILS</p>

                      {/* Email */}
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 flex-1">
                          <Mail size={16} className="text-gray-400" />
                          <div>
                            <p className="text-gray-500 text-xs">Email</p>
                            <p className="text-white font-mono text-sm">
                              {revealedFields.has(`email-${order.id}`) ? order.customer_email : maskEmail(order.customer_email || '')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleRevealField(`email-${order.id}`)}
                            className="text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            {revealedFields.has(`email-${order.id}`) ? <Eye size={16} /> : <Eye size={16} className="opacity-50" />}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopyToClipboard(order.customer_email || '', `email-${order.id}`)}
                            className="text-gray-400 hover:text-green-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            {copiedField === `email-${order.id}` ? <Check size={16} /> : <Copy size={16} />}
                          </motion.button>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 flex-1">
                          <Phone size={16} className="text-gray-400" />
                          <div>
                            <p className="text-gray-500 text-xs">Phone</p>
                            <p className="text-white font-mono text-sm">
                              {revealedFields.has(`phone-${order.id}`) ? order.customer_phone : maskPhone(order.customer_phone || '')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleRevealField(`phone-${order.id}`)}
                            className="text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            {revealedFields.has(`phone-${order.id}`) ? <Eye size={16} /> : <Eye size={16} className="opacity-50" />}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopyToClipboard(order.customer_phone || '', `phone-${order.id}`)}
                            className="text-gray-400 hover:text-green-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            {copiedField === `phone-${order.id}` ? <Check size={16} /> : <Copy size={16} />}
                          </motion.button>
                        </div>
                      </div>

                      {/* Address */}
                      {order.customer_address && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-gray-500 text-xs mb-2">Address</p>
                          <p className="text-white text-sm">{order.customer_address}</p>
                        </div>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-gray-500 text-xs tracking-widest mb-2">ORDER DATE</p>
                      <p className="text-gray-300 text-sm">{new Date(order.created * 1000).toLocaleString()}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
