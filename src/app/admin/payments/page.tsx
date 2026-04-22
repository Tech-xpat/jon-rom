'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, X, Loader2, AlertCircle, Eye } from 'lucide-react'
import Link from 'next/link'

interface Payment {
  id: string
  userId: string
  userEmail: string
  amount: number
  fanLevel: string
  method: string
  proofUrl: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

export default function AdminPaymentsPage() {
  const { user, isAdmin, loading } = useAdminAuth()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loadingPayments, setLoadingPayments] = useState(true)
  const [error, setError] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login')
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments')
      if (res.ok) {
        const data = await res.json()
        setPayments(data)
      }
    } catch (err) {
      setError('Failed to load payments')
    } finally {
      setLoadingPayments(false)
    }
  }

  const handleApprove = async (paymentId: string) => {
    setProcessing(true)
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, action: 'approve' }),
      })

      if (res.ok) {
        setPayments(prev =>
          prev.map(p => p.id === paymentId ? { ...p, status: 'approved' } : p)
        )
        setShowModal(false)
      }
    } catch (err) {
      setError('Failed to approve payment')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (paymentId: string) => {
    setProcessing(true)
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, action: 'reject' }),
      })

      if (res.ok) {
        setPayments(prev =>
          prev.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p)
        )
        setShowModal(false)
      }
    } catch (err) {
      setError('Failed to reject payment')
    } finally {
      setProcessing(false)
    }
  }

  if (loading || loadingPayments) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading payments...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) return null

  const pendingPayments = payments.filter(p => p.status === 'pending')
  const approvedPayments = payments.filter(p => p.status === 'approved')
  const rejectedPayments = payments.filter(p => p.status === 'rejected')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <header className="bg-red-900/20 border-b border-red-800/50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-widest">PAYMENT VERIFICATION</h1>
          <Link href="/admin" className="text-gray-400 hover:text-white">Back to Admin</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="flex items-center gap-3 bg-red-900/20 border border-red-800/50 rounded-lg p-4 text-red-300 mb-6">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4">
            <p className="text-yellow-400 font-bold text-2xl">{pendingPayments.length}</p>
            <p className="text-gray-400 text-sm">PENDING REVIEW</p>
          </div>
          <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4">
            <p className="text-green-400 font-bold text-2xl">{approvedPayments.length}</p>
            <p className="text-gray-400 text-sm">APPROVED</p>
          </div>
          <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
            <p className="text-red-400 font-bold text-2xl">{rejectedPayments.length}</p>
            <p className="text-gray-400 text-sm">REJECTED</p>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black tracking-widest">PENDING PAYMENTS</h2>

          {pendingPayments.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
              <p className="text-gray-400">No pending payments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map(payment => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-xs">EMAIL</p>
                      <p className="text-white font-bold">{payment.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">AMOUNT</p>
                      <p className="text-white font-bold">${payment.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">LEVEL</p>
                      <p className="text-white font-bold capitalize">{payment.fanLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">METHOD</p>
                      <p className="text-white font-bold uppercase">{payment.method}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedPayment(payment)
                        setShowModal(true)
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye size={16} />
                      VIEW PROOF
                    </button>
                    <button
                      onClick={() => handleApprove(payment.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Check size={16} />
                      APPROVE
                    </button>
                    <button
                      onClick={() => handleReject(payment.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <X size={16} />
                      REJECT
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Payments */}
        {approvedPayments.length > 0 && (
          <div className="space-y-4 mt-12">
            <h2 className="text-2xl font-black tracking-widest">APPROVED PAYMENTS</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg divide-y divide-white/10">
              {approvedPayments.map(payment => (
                <div key={payment.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">{payment.userEmail}</p>
                    <p className="text-gray-400 text-sm">${payment.amount} - {payment.fanLevel}</p>
                  </div>
                  <Check size={20} className="text-green-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Payment Proof Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="sticky top-0 bg-black border-b border-white/10 p-6 flex items-center justify-between">
              <h3 className="text-xl font-black tracking-widest">PAYMENT PROOF</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">USER EMAIL</p>
                <p className="text-white font-bold">{selectedPayment.userEmail}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">PAYMENT PROOF IMAGE</p>
                <img
                  src={selectedPayment.proofUrl}
                  alt="Payment proof"
                  className="w-full rounded-lg max-h-96 object-contain"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-xs">AMOUNT</p>
                  <p className="text-white font-bold">${selectedPayment.amount}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-xs">LEVEL</p>
                  <p className="text-white font-bold capitalize">{selectedPayment.fanLevel}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-xs">METHOD</p>
                  <p className="text-white font-bold uppercase">{selectedPayment.method}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleApprove(selectedPayment.id)}
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  APPROVE & WHITELIST
                </button>
                <button
                  onClick={() => handleReject(selectedPayment.id)}
                  disabled={processing}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
                  REJECT
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
