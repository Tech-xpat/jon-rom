'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, Loader2, AlertCircle, Check, Bitcoin, FileText } from 'lucide-react'
import Link from 'next/link'

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
  const { user, isAdmin, loading, getToken } = useAdminAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [methods, setMethods] = useState<PaymentMethods>({
    crypto: { btc: { address: '', enabled: false }, usdt: { address: '', enabled: false } },
    stripe: { publishableKey: '', enabled: false },
    paypal: { clientId: '', enabled: false },
    cashapp: { handle: '', enabled: false },
  })

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login')
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      setLoadingData(true)
      const token = await getToken()
      const res = await fetch('/api/admin/payment-methods', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMethods(data)
      }
    } catch (err) {
      console.error('Failed to load payment methods:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const token = await getToken()
      const res = await fetch('/api/admin/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(methods),
      })

      if (res.ok) {
        setSuccess('Payment methods saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const err = await res.json()
        setError(err.error || 'Failed to save payment methods')
      }
    } catch (err) {
      setError('Error saving payment methods')
    } finally {
      setSaving(false)
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading payment methods...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-red-900/20 border-b border-red-800/50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-black tracking-widest">PAYMENT METHODS</h1>
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">Back to Admin</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Notifications */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-red-900/20 border border-red-800/50 rounded-lg p-4 text-red-300 mb-6"
          >
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-green-900/20 border border-green-800/50 rounded-lg p-4 text-green-300 mb-6"
          >
            <Check size={18} className="flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Cryptocurrency */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Bitcoin className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold tracking-widest">CRYPTOCURRENCY PAYMENTS</h2>
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
                  className="rounded"
                />
                <label htmlFor="btc_enabled" className="text-sm font-bold">Enable Bitcoin (BTC)</label>
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
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded text-xs font-mono focus:outline-none focus:border-red-500"
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
                  className="rounded"
                />
                <label htmlFor="usdt_enabled" className="text-sm font-bold">Enable USDT (ERC-20)</label>
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
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded text-xs font-mono focus:outline-none focus:border-red-500"
                  disabled={!methods.crypto.usdt.enabled}
                />
              </div>
            </div>
          </div>

          {/* PayPal */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold tracking-widest">PAYPAL</h2>
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="paypal_enabled"
                  checked={methods.paypal.enabled}
                  onChange={(e) => setMethods({
                    ...methods,
                    paypal: { ...methods.paypal, enabled: e.target.checked }
                  })}
                  className="rounded"
                />
                <label htmlFor="paypal_enabled" className="text-sm font-bold">Enable PayPal</label>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">PAYPAL CLIENT ID</label>
                <input
                  type="text"
                  value={methods.paypal.clientId}
                  onChange={(e) => setMethods({
                    ...methods,
                    paypal: { ...methods.paypal, clientId: e.target.value }
                  })}
                  placeholder="Your PayPal Client ID"
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-red-500"
                  disabled={!methods.paypal.enabled}
                />
              </div>
            </div>
          </div>

          {/* Stripe */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold tracking-widest">STRIPE</h2>
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stripe_enabled"
                  checked={methods.stripe.enabled}
                  onChange={(e) => setMethods({
                    ...methods,
                    stripe: { ...methods.stripe, enabled: e.target.checked }
                  })}
                  className="rounded"
                />
                <label htmlFor="stripe_enabled" className="text-sm font-bold">Enable Stripe</label>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">STRIPE PUBLISHABLE KEY</label>
                <input
                  type="text"
                  value={methods.stripe.publishableKey}
                  onChange={(e) => setMethods({
                    ...methods,
                    stripe: { ...methods.stripe, publishableKey: e.target.value }
                  })}
                  placeholder="pk_live_..."
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-red-500"
                  disabled={!methods.stripe.enabled}
                />
              </div>
            </div>
          </div>

          {/* CashApp */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold tracking-widest">CASHAPP</h2>
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cashapp_enabled"
                  checked={methods.cashapp.enabled}
                  onChange={(e) => setMethods({
                    ...methods,
                    cashapp: { ...methods.cashapp, enabled: e.target.checked }
                  })}
                  className="rounded"
                />
                <label htmlFor="cashapp_enabled" className="text-sm font-bold">Enable CashApp</label>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">CASHAPP HANDLE ($)</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">$</span>
                  <input
                    type="text"
                    value={methods.cashapp.handle}
                    onChange={(e) => setMethods({
                      ...methods,
                      cashapp: { ...methods.cashapp, handle: e.target.value }
                    })}
                    placeholder="jonathanroumie"
                    className="flex-1 bg-white/5 border border-white/10 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-red-500"
                    disabled={!methods.cashapp.enabled}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold tracking-widest transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE PAYMENT METHODS</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </main>
    </div>
  )
}
