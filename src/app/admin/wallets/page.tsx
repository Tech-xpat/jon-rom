'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Edit2, Save, X, AlertCircle } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import AdminHeader from '@/components/admin/AdminHeader'

interface Wallet {
  id: string
  name: string
  type: 'crypto' | 'cashapp' | 'venmo'
  address: string
  icon: string
  active: boolean
}

export default function WalletsPage() {
  const { isAuthenticated } = useAdminAuth()
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: '1',
      name: 'Bitcoin (BTC)',
      type: 'crypto',
      address: '1A1z7agoat2GPFH7pPmnz5h5ywXceaTQ1n',
      icon: '₿',
      active: true,
    },
    {
      id: '2',
      name: 'USDT (Ethereum)',
      type: 'crypto',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      icon: 'Ⓥ',
      active: true,
    },
    {
      id: '3',
      name: 'Cash App',
      type: 'cashapp',
      address: '$tinabeingblessed',
      icon: '💵',
      active: true,
    },
    {
      id: '4',
      name: 'Venmo',
      type: 'venmo',
      address: 'Tina-McGowan-17',
      icon: 'Ⓥ',
      active: true,
    },
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Admin access required</p>
      </div>
    )
  }

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleEdit = (wallet: Wallet) => {
    setEditingId(wallet.id)
    setEditValue(wallet.address)
  }

  const handleSave = (id: string) => {
    setWallets(wallets.map(w => 
      w.id === id ? { ...w, address: editValue } : w
    ))
    setEditingId(null)
  }

  const toggleActive = (id: string) => {
    setWallets(wallets.map(w =>
      w.id === id ? { ...w, active: !w.active } : w
    ))
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-white text-4xl font-black tracking-widest mb-2">PAYMENT WALLETS</h1>
            <p className="text-gray-400">Manage all transaction wallet addresses in one place</p>
          </div>

          <div className="space-y-4">
            {wallets.map((wallet, idx) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white/5 border rounded-xl p-6 transition-all ${
                  wallet.active ? 'border-white/20 hover:bg-white/10' : 'border-red-500/30 bg-red-900/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{wallet.icon}</span>
                      <div>
                        <h3 className="text-white font-bold">{wallet.name}</h3>
                        <p className="text-gray-500 text-xs">{wallet.type.toUpperCase()}</p>
                      </div>
                    </div>

                    {editingId === wallet.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleSave(wallet.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                        >
                          <Save size={18} />
                          SAVE
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="bg-black/30 rounded-lg px-4 py-3 font-mono text-sm text-gray-300 break-all">
                        {wallet.address}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingId !== wallet.id && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(wallet.address, wallet.id)}
                          className="text-gray-400 hover:text-blue-400 transition-colors p-2"
                        >
                          {copiedId === wallet.id ? (
                            <Check size={20} className="text-green-400" />
                          ) : (
                            <Copy size={20} />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(wallet)}
                          className="text-gray-400 hover:text-blue-400 transition-colors p-2"
                        >
                          <Edit2 size={20} />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>

                {/* Active Status Toggle */}
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-gray-400 text-xs tracking-widest">STATUS</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleActive(wallet.id)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs tracking-widest transition-all ${
                      wallet.active
                        ? 'bg-green-600/20 text-green-400 border border-green-500/50'
                        : 'bg-red-600/20 text-red-400 border border-red-500/50'
                    }`}
                  >
                    {wallet.active ? 'ACTIVE' : 'INACTIVE'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-6 flex items-start gap-3"
          >
            <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-bold mb-2">ACTIVE WALLETS: {wallets.filter(w => w.active).length}</h3>
              <p className="text-gray-400 text-sm">
                All payment methods update across the website in real-time. Deactivate wallets to remove them from checkout.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
