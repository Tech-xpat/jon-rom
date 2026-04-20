'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, Clock, CheckCircle, AlertCircle, Download, QrCode,
  User, DollarSign, CreditCard, RefreshCw, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { useUserAuth } from '@/components/user/UserAuthProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'confirmed' | 'failed'
  qrCode?: string
  transactionId?: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, loading, whitelisted, fanStatus, logout, getToken } = useUserAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [txLoading, setTxLoading] = useState(true)
  const [showQr, setShowQr] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirmed' | 'unpaid' | null>(null)

  const loadData = async (silent = false) => {
    if (!user) return
    if (!silent) setTxLoading(true)
    else setRefreshing(true)

    try {
      const token = await getToken()
      if (!token) return

      const [txRes, statusRes] = await Promise.all([
        fetch('/api/user/transactions', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/user/status', { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (txRes.ok) setTransactions(await txRes.json())
      if (statusRes.ok) {
        const s = await statusRes.json()
        setPaymentStatus(s.paymentStatus)
      }
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setTxLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm tracking-widest">LOADING...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-white text-2xl font-black mb-2">Not Signed In</h1>
          <p className="text-gray-400 mb-6">Please sign in to access your dashboard.</p>
          <Link
            href="/fan-card"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const isApproved = whitelisted && fanStatus === 'approved'
  const hasPendingPayment = !isApproved && transactions.some(t => t.status === 'pending')
  const hasConfirmedPayment = !isApproved && transactions.some(t => t.status === 'confirmed')

  return (
    <div className="min-h-screen bg-black">
      <Header variant="main" />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white text-3xl font-black tracking-widest">YOUR DASHBOARD</h1>
                <p className="text-gray-500 text-sm mt-1 font-mono">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadData(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 text-red-400 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">

            {/* ── PENDING APPROVAL STATE ── */}
            {!isApproved && (
              <motion.div
                key="pending"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4 mb-8"
              >
                {/* Main status card */}
                <div className="bg-yellow-900/15 border border-yellow-800/40 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Clock size={32} className="text-yellow-400" />
                  </div>
                  <h2 className="text-white text-xl font-black tracking-wide mb-2">
                    {hasPendingPayment || hasConfirmedPayment
                      ? 'Payment Under Review'
                      : 'Awaiting Admin Approval'}
                  </h2>
                  <p className="text-yellow-300/80 text-sm leading-relaxed max-w-sm mx-auto">
                    {hasPendingPayment || hasConfirmedPayment
                      ? 'Your deposit has been received. Admin will verify it and unlock your full dashboard access shortly.'
                      : 'Your account is pending admin approval. Submit a payment to get your fan card access.'}
                  </p>
                </div>

                {/* Steps */}
                <div className="bg-white/3 border border-white/5 rounded-2xl p-6 space-y-4">
                  <p className="text-white font-bold text-xs tracking-widest">APPROVAL STEPS</p>
                  {[
                    {
                      step: 1,
                      label: 'Account Registered',
                      desc: 'Google sign-in complete',
                      done: true,
                    },
                    {
                      step: 2,
                      label: 'Deposit Submitted',
                      desc: hasPendingPayment || hasConfirmedPayment
                        ? `${transactions.filter(t => t.status !== 'failed').length} deposit(s) on record`
                        : 'Submit payment at the fan card page',
                      done: hasPendingPayment || hasConfirmedPayment,
                    },
                    {
                      step: 3,
                      label: 'Admin Verifies Payment',
                      desc: 'Usually within 24 hours',
                      done: false,
                    },
                    {
                      step: 4,
                      label: 'Full Access Unlocked',
                      desc: 'Download your official fan card',
                      done: false,
                    },
                  ].map(({ step, label, desc, done }) => (
                    <div key={step} className="flex items-start gap-4">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold border ${done
                          ? 'bg-green-900/40 border-green-600/60 text-green-300'
                          : 'bg-white/5 border-white/15 text-gray-500'
                        }`}>
                        {done ? '✓' : step}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${done ? 'text-green-300' : 'text-gray-300'}`}>{label}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA if no payment yet */}
                {!hasPendingPayment && !hasConfirmedPayment && (
                  <Link
                    href="/fan-card"
                    className="flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold tracking-widest transition-colors"
                  >
                    <CreditCard size={20} />
                    Submit Payment for Fan Card
                    <ArrowRight size={16} />
                  </Link>
                )}
              </motion.div>
            )}

            {/* ── APPROVED / WHITELISTED STATE ── */}
            {isApproved && (
              <motion.div
                key="approved"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/3 border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle size={20} className="text-green-400" />
                      <p className="text-gray-400 text-xs tracking-widest">STATUS</p>
                    </div>
                    <p className="text-green-400 text-2xl font-black">Approved</p>
                  </div>

                  <div className="bg-white/3 border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <User size={20} className="text-red-400" />
                      <p className="text-gray-400 text-xs tracking-widest">WHITELIST</p>
                    </div>
                    <p className="text-green-400 text-2xl font-black">Active</p>
                  </div>

                  <div className="bg-white/3 border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign size={20} className="text-blue-400" />
                      <p className="text-gray-400 text-xs tracking-widest">TRANSACTIONS</p>
                    </div>
                    <p className="text-white text-2xl font-black">{transactions.length}</p>
                  </div>
                </div>

                {/* Fan Card CTA */}
                <div className="bg-white/3 border border-white/5 rounded-2xl p-8">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-white text-lg font-black tracking-widest mb-1">YOUR FAN CARD</h2>
                      <p className="text-gray-400 text-sm">Your official Jonathan Roumie fan card is ready to personalize and download.</p>
                    </div>
                    <Link
                      href="/fan-card"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold tracking-wide transition-colors whitespace-nowrap"
                    >
                      <Download size={18} />
                      Get Your Card
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* ── TRANSACTION HISTORY (always shown if there are any) ── */}
          {(isApproved || transactions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/3 border border-white/5 rounded-2xl p-8 mt-6"
            >
              <h2 className="text-white text-lg font-black tracking-widest mb-6">DEPOSIT HISTORY</h2>

              {txLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white/3 rounded-lg h-20 animate-pulse" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <QrCode size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No deposits yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-base font-bold">
                            {tx.currency === 'BTC' ? '₿' : tx.currency === 'USDT' ? '₮' : '$'}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{tx.amount} {tx.currency}</p>
                            <p className="text-gray-500 text-xs">{new Date(tx.createdAt).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-3 py-1.5 rounded-full font-bold tracking-wide ${
                            tx.status === 'confirmed'
                              ? 'bg-green-900/30 text-green-400'
                              : tx.status === 'pending'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : 'bg-red-900/30 text-red-400'
                          }`}>
                            {tx.status === 'pending' ? '⏳ Pending' : tx.status === 'confirmed' ? '✓ Confirmed' : '✗ Failed'}
                          </span>
                          {tx.qrCode && (
                            <button
                              onClick={() => setShowQr(showQr === tx.id ? null : tx.id)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                              title="Show QR Code"
                            >
                              <QrCode size={16} className="text-gray-400" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* QR expand */}
                      <AnimatePresence>
                        {showQr === tx.id && tx.qrCode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-white/10"
                          >
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                              <img src={tx.qrCode} alt="QR Code" className="w-40 h-40 mx-auto rounded-lg" />
                              {tx.transactionId && (
                                <p className="text-gray-400 text-xs mt-3 font-mono break-all">TX: {tx.transactionId}</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </div>
      </main>

      <Footer variant="main" />
    </div>
  )
                  }
                                    
