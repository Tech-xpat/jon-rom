'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, Loader2, AlertCircle, Check, Bitcoin } from 'lucide-react'
import Link from 'next/link'
import { useFirestoreListener } from '@/hooks/useFirestoreListener'
import { useFirestoreSync } from '@/hooks/useFirestoreSync'
import AdminHeader from '@/components/admin/AdminHeader'

interface CryptoWalletsData {
  btc?: { address: string; verified?: boolean }
  usdt?: { address: string; verified?: boolean }
  updatedAt?: string
  updatedBy?: string
}

interface PaymentMethods {
  crypto: {
    btc: { address: string; enabled: boolean }
    usdt: { address: string; enabled: boolean }
  }
  stripe: {
    publishableKey: string
    enabled: boolean
  }
  paypal: {
    clientId: string
    enabled: boolean
  }
  cashapp: {
    handle: string
    enabled: boolean
  }
}

export default function AdminPaymentMethodsPage() {
  const router = useRouter()
  
  // Real-time listeners for data
  const { data: firestoreWallets, loading: loadingWallets } = useFirestoreListener<CryptoWalletsData>('pageSettings', 'cryptoWallets')
  const { sync: syncCryptoWallets, isSyncing: syncingCryptoWallets } = useFirestoreSync('pageSettings')
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [successType, setSuccessType] = useState<'crypto' | 'other' | ''>('')
  const [methods, setMethods] = useState<PaymentMethods>({
    crypto: { btc: { address: '', enabled: false }, usdt: { address: '', enabled: false } },
    stripe: { publishableKey: '', enabled: false },
    paypal: { clientId: '', enabled: false },
    cashapp: { handle: '', enabled: false },
  })

  // Sync Firestore wallet data to local state
  useEffect(() => {
    if (firestoreWallets) {
      console.log('[Payment] Syncing Firestore wallet data:', firestoreWallets)
      setMethods(prev => ({
        ...prev,
        crypto: {
          btc: {
            address: firestoreWallets.btc?.address || '',
            enabled: Boolean(firestoreWallets.btc?.address),
          },
          usdt: {
            address: firestoreWallets.usdt?.address || '',
            enabled: Boolean(firestoreWallets.usdt?.address),
          },
        },
      }))
    }
  }, [firestoreWallets])

  const handleSaveCrypto = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
  
  if (loadingWallets) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading payment methods...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h1 className="text-white text-4xl font-black tracking-widest mb-2">PAYMENT METHODS</h1>
            <p className="text-gray-400">Manage cryptocurrency payment wallets. Changes update instantly across the site!</p>
          </div>

          {/* Notifications */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-red-900/20 border border-red-800/50 rounded-lg p-4 text-red-300"
            >
              <AlertCircle size={18} className="flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-green-900/20 border border-green-800/50 rounded-lg p-4 text-green-300"
            >
              <Check size={18} className="flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </motion.div>
          )}

          {/* Cryptocurrency Section */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Bitcoin className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold tracking-widest text-white">CRYPTOCURRENCY PAYMENTS</h2>
            </div>

            {/* Bitcoin */}
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="btc_enabled"
                  checked={methods.crypto.btc.enabled}
                  onChange={(e) => setMethods({
                    ...methods,
                    crypto: { ...methods.crypto, btc: { ...methods.crypto.btc, enabled: e.target.checked } }
                  })}
                  className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
                />
                <label htmlFor="btc_enabled" className="text-sm font-bold text-white cursor-pointer">Enable Bitcoin (BTC)</label>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">BITCOIN ADDRESS</label>
                <input
                  type="text"
                  value={methods.crypto.btc.address}
                  onChange={(e) => setMethods({
                    ...methods,
                    crypto: { ...methods.crypto, btc: { ...methods.crypto.btc, address: e.target.value } }
                  })}
                  placeholder="e.g., 1A1z7agoat2LWLCZFBX3xCjYjnAEoM81tS"
                  className="w-full bg-white/5 border border-white/20 text-white px-3 py-2 rounded text-xs font-mono focus:outline-none focus:border-orange-500"
                  disabled={!methods.crypto.btc.enabled}
                />
              </div>
            </div>

            {/* USDT */}
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="usdt_enabled"
                  checked={methods.crypto.usdt.enabled}
                  onChange={(e) => setMethods({
                    ...methods,
                    crypto: { ...methods.crypto, usdt: { ...methods.crypto.usdt, enabled: e.target.checked } }
                  })}
                  className="w-4 h-4 rounded accent-green-500 cursor-pointer"
                />
                <label htmlFor="usdt_enabled" className="text-sm font-bold text-white cursor-pointer">Enable USDT (ERC-20)</label>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">USDT ETHEREUM ADDRESS</label>
                <input
                  type="text"
                  value={methods.crypto.usdt.address}
                  onChange={(e) => setMethods({
                    ...methods,
                    crypto: { ...methods.crypto, usdt: { ...methods.crypto.usdt, address: e.target.value } }
                  })}
                  placeholder="e.g., 0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                  className="w-full bg-white/5 border border-white/20 text-white px-3 py-2 rounded text-xs font-mono focus:outline-none focus:border-green-500"
                  disabled={!methods.crypto.usdt.enabled}
                />
              </div>
            </div>

            {/* Save Crypto Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveCrypto}
              disabled={saving || syncingCryptoWallets}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-lg font-bold tracking-widest transition-all"
            >
              {saving || syncingCryptoWallets ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>SAVE CRYPTOCURRENCY WALLETS</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              ✓ All updates are synced to Firestore in real-time and appear instantly on the fan card and checkout pages.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
