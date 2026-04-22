'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminCardPricingPage() {
  const { user, isAdmin, loading } = useAdminAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pricing, setPricing] = useState({
    silver: 50,
    gold: 75,
    diamond: 150,
    cashappAccount: '$jonathanroumie',
    cashappName: 'Jonathan Roumie Fan Cards',
    btcAddress: '1A1z7agoat2LWLCZFBX3xCjYjnAEoM81tS',
    usdtAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
  })

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login')
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    loadPricing()
  }, [])

  const loadPricing = async () => {
    try {
      const res = await fetch('/api/admin/card-pricing')
      if (res.ok) {
        const data = await res.json()
        setPricing(data)
      }
    } catch (err) {
      setError('Failed to load pricing')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/card-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricing),
      })

      if (res.ok) {
        setSuccess('Pricing updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to save pricing')
      }
    } catch (err) {
      setError('Error saving pricing')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <header className="bg-red-900/20 border-b border-red-800/50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-widest">CARD PRICING & PAYMENT</h1>
          <Link href="/admin" className="text-gray-400 hover:text-white">Back to Admin</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="flex items-center gap-3 bg-red-900/20 border border-red-800/50 rounded-lg p-4 text-red-300 mb-6">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 bg-green-900/20 border border-green-800/50 rounded-lg p-4 text-green-300 mb-6">
            <span>✓ {success}</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Card Pricing */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-black tracking-widest">FAN CARD PRICING</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: 'silver', label: 'SILVER', icon: '⚪' },
                { key: 'gold', label: 'GOLD', icon: '✨' },
                { key: 'diamond', label: 'DIAMOND', icon: '💎' }
              ].map(level => (
                <div key={level.key} className="bg-black/50 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <span>{level.icon}</span>
                    {level.label}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={pricing[level.key as keyof typeof pricing]}
                      onChange={(e) => setPricing({
                        ...pricing,
                        [level.key]: parseFloat(e.target.value) || 0
                      })}
                      className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crypto Wallets */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-black tracking-widest">CRYPTO WALLETS</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold block mb-2">BITCOIN (BTC) ADDRESS</label>
                <input
                  type="text"
                  value={pricing.btcAddress}
                  onChange={(e) => setPricing({ ...pricing, btcAddress: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 rounded focus:outline-none focus:border-red-500 font-mono text-xs"
                  placeholder="Bitcoin address"
                />
              </div>

              <div>
                <label className="text-sm font-bold block mb-2">USDT (ERC-20) ADDRESS</label>
                <input
                  type="text"
                  value={pricing.usdtAddress}
                  onChange={(e) => setPricing({ ...pricing, usdtAddress: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 rounded focus:outline-none focus:border-red-500 font-mono text-xs"
                  placeholder="USDT Ethereum address"
                />
              </div>
            </div>
          </div>

          {/* CashApp Settings */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-black tracking-widest">CASHAPP PAYMENT</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold block mb-2">CASHAPP ACCOUNT ($)</label>
                <input
                  type="text"
                  value={pricing.cashappAccount}
                  onChange={(e) => setPricing({ ...pricing, cashappAccount: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 rounded focus:outline-none focus:border-red-500"
                  placeholder="$username"
                />
              </div>

              <div>
                <label className="text-sm font-bold block mb-2">ACCOUNT NAME (DISPLAY)</label>
                <input
                  type="text"
                  value={pricing.cashappName}
                  onChange={(e) => setPricing({ ...pricing, cashappName: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 rounded focus:outline-none focus:border-red-500"
                  placeholder="Account display name"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-4 rounded-lg font-black tracking-widest flex items-center justify-center gap-3 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                SAVING...
              </>
            ) : (
              <>
                <Save size={20} />
                SAVE PRICING & PAYMENT SETTINGS
              </>
            )}
          </button>
        </motion.div>
      </main>
    </div>
  )
}
