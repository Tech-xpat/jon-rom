'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Edit2, Save, X, AlertCircle, Loader2 } from 'lucide-react'
import { useFirestoreListener } from '@/hooks/useFirestoreListener'
import { useFirestoreSync } from '@/hooks/useFirestoreSync'
import AdminHeader from '@/components/admin/AdminHeader'

interface CryptoWalletsData {
  btc?: { address: string; verified?: boolean }
  usdt?: { address: string; verified?: boolean }
  updatedAt?: string
  updatedBy?: string
}

interface Wallet {
  id: string
  name: string
  type: 'BTC' | 'USDT'
  address: string
  icon: string
  active: boolean
}

export default function WalletsPage() {
  const { data: firestoreWallets, loading: loadingWallets, error: listenerError } = useFirestoreListener<CryptoWalletsData>('pageSettings', 'cryptoWallets')
  const { sync, isSyncing, error: syncError } = useFirestoreSync('pageSettings')
  
  const [wallets, setWallets] = useState<Wallet[]>([
    { id: 'BTC', name: 'Bitcoin (BTC)', type: 'BTC', address: '', icon: '₿', active: true },
    { id: 'USDT', name: 'USDT (Ethereum)', type: 'USDT', address: '', icon: 'Ⓥ', active: true },
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')

  // Sync Firestore data to local state
  useEffect(() => {
    if (firestoreWallets) {
      console.log('[Wallets] Syncing Firestore data to state:', firestoreWallets)
      setWallets([
        {
          id: 'BTC',
          name: 'Bitcoin (BTC)',
          type: 'BTC',
          address: firestoreWallets.btc?.address || '',
          icon: '₿',
          active: Boolean(firestoreWallets.btc?.address),
        },
        {
          id: 'USDT',
          name: 'USDT (Ethereum)',
          type: 'USDT',
          address: firestoreWallets.usdt?.address || '',
          icon: 'Ⓥ',
          active: Boolean(firestoreWallets.usdt?.address),
        },
      ])
    }
  }, [firestoreWallets])

  const saveWallet = async (id: string) => {
    const wallet = wallets.find((w) => w.id === id)
    if (!wallet) return

    try {
      console.log(`[Wallets] Saving ${wallet.type} wallet:`, wallet.address)
      
      // Save directly to Firestore using sync hook
      const key = wallet.type.toLowerCase()
      await sync('cryptoWallets', {
        [key]: { address: wallet.address, verified: false },
        updatedAt: new Date().toISOString(),
      })

      setNotification(`${wallet.name} updated successfully!`)
      setNotificationType('success')
      setEditingId(null)
      setTimeout(() => setNotification(null), 3000)
    } catch (error: any) {
      console.error('[Wallets] Save failed:', error)
      setNotification(error.message || 'Failed to update wallet')
      setNotificationType('error')
      setTimeout(() => setNotification(null), 3000)
    }
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
            <p className="text-gray-400">Manage all transaction wallet addresses in one place. Changes update instantly!</p>
          </div>

          {/* Notification */}
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-3 rounded-lg p-4 ${
                notificationType === 'success'
                  ? 'bg-green-900/20 border border-green-800/50'
                  : 'bg-red-900/20 border border-red-800/50'
              }`}
            >
              {notificationType === 'success' ? (
                <Check size={18} className="text-green-400" />
              ) : (
                <AlertCircle size={18} className="text-red-400" />
              )}
              <p className={notificationType === 'success' ? 'text-green-300' : 'text-red-300'}>
                {notification}
              </p>
            </motion.div>
          )}

          {/* Listener Error */}
          {listenerError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-red-900/20 border border-red-800/50 rounded-lg p-4"
            >
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="text-red-300 text-sm font-medium">Connection Error</p>
                <p className="text-red-400/80 text-xs mt-1">{listenerError}</p>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {loadingWallets ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                <Loader2 size={24} className="text-red-500 animate-spin mx-auto mb-2" />
                <p className="text-gray-400">Loading wallet configuration…</p>
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
                            placeholder="Enter wallet address"
                            className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSave(wallet.id)}
                            disabled={isSyncing}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-700/60 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
                          >
                            <Save size={18} />
                            {isSyncing ? 'Saving…' : 'SAVE'}
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
                          {wallet.address || <span className="text-gray-500 italic">Not configured</span>}
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
                            disabled={!wallet.address}
                            className="text-gray-400 hover:text-blue-400 transition-colors p-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                </motion.div>
              ))
            )}
          </div>

          {/* Real-time Sync Status */}
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="text-gray-400 text-xs">
              ✓ Real-time sync enabled. All changes save to Firestore and update across the site instantly.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
