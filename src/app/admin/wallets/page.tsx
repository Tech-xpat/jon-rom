'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bitcoin, Save, AlertCircle, Check } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'

interface WalletForm {
  btc: string
  usdt: string
}

export default function CryptoWalletsPage() {
  const { user, getToken } = useAdminAuth()
  const [form, setForm] = useState<WalletForm>({ btc: '', usdt: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function loadWallets() {
      try {
        const token = await getToken()
        const res = await fetch('/api/admin/wallets', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setForm({
            btc: data.btc?.address || '',
            usdt: data.usdt?.address || '',
          })
        }
      } catch (err) {
        console.error('Failed to load wallets:', err)
        setMessage({ type: 'error', text: 'Failed to load wallet addresses' })
      } finally {
        setLoading(false)
      }
    }
    loadWallets()
  }, [getToken])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Wallet addresses updated successfully' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        const err = await res.json()
        setMessage({ type: 'error', text: err.error || 'Failed to save wallet addresses' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while saving' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-black tracking-widest">CRYPTO WALLETS</h1>
        <p className="text-gray-500 text-sm mt-1">Configure wallet addresses for cryptocurrency payments</p>
      </div>

      {loading ? (
        <div className="bg-white/3 border border-white/5 rounded-2xl p-8 animate-pulse">
          <div className="h-32 bg-white/5 rounded-lg" />
        </div>
      ) : (
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/3 border border-white/5 rounded-2xl p-8 space-y-8"
          >
            {/* BTC Wallet */}
            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Bitcoin size={18} className="text-orange-500" />
                Bitcoin (BTC) Wallet Address
              </label>
              <p className="text-gray-400 text-sm mb-4">
                Enter your Bitcoin wallet address for customer payments. Customers will send BTC to this address.
              </p>
              <input
                type="text"
                value={form.btc}
                onChange={(e) => setForm({ ...form, btc: e.target.value })}
                placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm"
              />
              {form.btc && (
                <div className="mt-2 text-xs text-gray-400">
                  Length: {form.btc.length} characters
                </div>
              )}
            </div>

            {/* USDT Wallet */}
            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-green-500">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <text x="12" y="14" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">
                    U
                  </text>
                </svg>
                Tether USDT Wallet Address
              </label>
              <p className="text-gray-400 text-sm mb-4">
                Enter your Ethereum address to receive USDT payments. Use an ERC-20 compatible address.
              </p>
              <input
                type="text"
                value={form.usdt}
                onChange={(e) => setForm({ ...form, usdt: e.target.value })}
                placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f12345"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-green-500 transition-colors font-mono text-sm"
              />
              {form.usdt && (
                <div className="mt-2 text-xs text-gray-400">
                  Length: {form.usdt.length} characters
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-semibold mb-1">Important:</p>
                <p>
                  Only Bitcoin and USDT are active. PayPal and Stripe payments are configured separately. 
                  Test addresses thoroughly before going live.
                </p>
              </div>
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-900/20 border border-green-800/50 text-green-300'
                    : 'bg-red-900/20 border border-red-800/50 text-red-300'
                }`}
              >
                {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                <span>{message.text}</span>
              </motion.div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Wallet Addresses'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
