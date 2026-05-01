'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Edit2, Save, X, AlertCircle } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import AdminHeader from '@/components/admin/AdminHeader'

interface Wallet {
  id: string
  name: string
  type: 'BTC' | 'USDT'
  address: string
  icon: string
  active: boolean
}

export default function WalletsPage() {
  const { isAdmin, getToken } = useAdminAuth()
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: 'BTC',
      name: 'Bitcoin (BTC)',
      type: 'BTC',
      address: '',
      icon: '₿',
      active: true,
    },
    {
      id: 'USDT',
      name: 'USDT (Ethereum)',
      type: 'USDT',
      address: '',
      icon: 'Ⓥ',
      active: true,
    },
  ])
  const [loadingWallets, setLoadingWallets] = useState(true)
  const [savingWallet, setSavingWallet] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const loadWallets = async () => {
    setLoadingWallets(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/wallets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        throw new Error('Failed to fetch wallet settings')
      }
      const data = await res.json()
      setWallets([
        {
          id: 'BTC',
          name: 'Bitcoin (BTC)',
          type: 'BTC',
          address: data.btc?.address || '',
          icon: '₿',
          active: Boolean(data.btc?.address),
        },
        {
          id: 'USDT',
          name: 'USDT (Ethereum)',
          type: 'USDT',
          address: data.usdt?.address || '',
          icon: 'Ⓥ',
          active: Boolean(data.usdt?.address),
        },
      ])
    } catch (error) {
      console.error('[Wallets] Load failed:', error)
    } finally {
      setLoadingWallets(false)
    }
  }

  const saveWallet = async (id: string) => {
    const wallet = wallets.find((w) => w.id === id)
    if (!wallet) return

    setSavingWallet(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: wallet.type,
          address: wallet.address,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Unable to save wallet')
      }

      setNotification(`${wallet.name} updated successfully`)
      setEditingId(null)
      setTimeout(() => setNotification(null), 3000)
      await loadWallets()
    } catch (error: any) {
      console.error('[Wallets] Save failed:', error)
      setNotification(error.message || 'Failed to update wallet')
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setSavingWallet(false)
    }
  }

  const toggleActive = (id: string) => {
    setWallets(wallets.map((w) => (w.id === id ? { ...w, active: !w.active } : w)))
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

  const handleSave = async (id: string) => {
    setWallets(wallets.map((w) => (w.id === id ? { ...w, address: editValue } : w)))
    await saveWallet(id)
  }

  useEffect(() => {
    if (!isAdmin) return
    loadWallets()
  }, [isAdmin])

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Admin access required</p>
      </div>
    )
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
            {loadingWallets ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
                Loading wallet configuration…
              </div>
            ) : (
              wallets.map((wallet, idx) => (
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
                            type="button"
                            onClick={() => handleSave(wallet.id)}
                            disabled={savingWallet}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-700/60 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
                          >
                            <Save size={18} />
                            {savingWallet ? 'Saving…' : 'SAVE'}
                          </button>
                          <button
                            type="button"
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
              )))

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
