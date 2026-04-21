'use client'

import { useState, useEffect } from 'react'
import { useUserAuth } from '@/components/user/UserAuthProvider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PaymentProofPage() {
  const { user, loading, getToken } = useUserAuth()
  const router = useRouter()
  const [paymentProofUrl, setPaymentProofUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [confirmPaid, setConfirmPaid] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      // For now, store as data URL. In production, use a proper storage service
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPaymentProofUrl(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!confirmPaid || !paymentProofUrl) {
      setError('Please confirm payment and upload proof')
      return
    }

    setUploading(true)
    setError('')

    try {
      const token = await getToken()
      if (!token) return

      const res = await fetch('/api/user/submit-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentProofUrl,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError('Failed to submit payment')
      }
    } catch (err) {
      setError('Error submitting payment')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <CheckCircle size={64} className="text-green-400 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-black tracking-widest">PAYMENT SUBMITTED</h2>
          <p className="text-gray-400">Your payment proof has been received. Admin will verify and contact you within 24 hours.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header variant="main" />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-widest mb-4">UPLOAD PAYMENT PROOF</h1>
              <p className="text-gray-400 text-lg">Please upload screenshot or receipt of your payment transaction</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
              {error && (
                <div className="flex items-center gap-3 bg-red-900/20 border border-red-800/50 rounded-lg p-4 text-red-300">
                  <AlertCircle size={18} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* File Upload Area */}
              <div>
                <label className="text-gray-400 text-xs tracking-widest block mb-4">PAYMENT PROOF</label>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    paymentProofUrl
                      ? 'border-green-500 bg-green-900/10'
                      : 'border-white/20 hover:border-white/40 bg-white/2'
                  }`}>
                    {paymentProofUrl ? (
                      <div className="space-y-4">
                        <img
                          src={paymentProofUrl}
                          alt="Payment Proof"
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                        <p className="text-green-400 font-semibold">✓ Image uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload size={32} className="mx-auto text-gray-400" />
                        <p className="text-white font-semibold">Click to upload payment proof</p>
                        <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Confirmation Checkbox */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmPaid}
                    onChange={(e) => setConfirmPaid(e.target.checked)}
                    className="w-5 h-5 rounded mt-1 cursor-pointer"
                  />
                  <span className="text-gray-300 text-sm">
                    I confirm that I have completed the payment of <span className="font-bold">$50 USD</span> for the Jonathan Roumie Fan Card and uploaded valid proof of transaction.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Link
                  href="/dashboard/card-payment"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold tracking-widest transition-colors text-center border border-white/20"
                >
                  BACK
                </Link>
                <button
                  onClick={handleSubmit}
                  disabled={uploading || !paymentProofUrl || !confirmPaid}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold tracking-widest transition-colors flex items-center justify-center gap-3"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      SUBMITTING...
                    </>
                  ) : (
                    'SUBMIT PAYMENT'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer variant="main" />
    </div>
  )
}
